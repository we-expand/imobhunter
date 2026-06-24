import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Mail, 
  MessageSquare, 
  Linkedin, 
  Database,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Phone,
  Send,
  Instagram,
  Search,
  Key,
  Shield
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppRealConnection } from './whatsapp-real-connection';
import { LinkedInQRAuth } from './linkedin-qr-auth';
import { SocialIntegrationsSettings } from './social-integrations-settings';
import { InstagramIntegration } from './instagram-integration';
import { SearchAPIsConfig } from './SearchAPIsConfig';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { emailService } from '../lib/email-service';
import { searchAPI } from '../lib/api/searchAPI';

interface IntegrationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  status: 'connected' | 'disconnected' | 'pending';
  gradient: string;
  accentColor: string;
  children?: React.ReactNode;
  comingSoon?: boolean;
}

function IntegrationCard({ 
  icon: Icon, 
  title, 
  description, 
  status, 
  gradient,
  accentColor,
  children,
  comingSoon = false
}: IntegrationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/10 bg-zinc-900/40 backdrop-blur-sm group hover:border-white/20">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
        
        {comingSoon && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              Coming Soon
            </Badge>
          </div>
        )}
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <motion.div 
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg bg-opacity-20`}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>
              
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 mb-1 text-white">
                  {title}
                  {status === 'connected' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  )}
                </CardTitle>
                <CardDescription className="text-zinc-400">{description}</CardDescription>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            {status === 'connected' ? (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-emerald-400 font-medium">Connected</span>
              </div>
            ) : status === 'pending' ? (
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-amber-500 font-medium">Configuring...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-zinc-600 rounded-full" />
                <span className="text-zinc-500 font-medium">Disconnected</span>
              </div>
            )}
          </div>
        </CardHeader>

        {children && (
          <>
            <CardContent className="relative">
              <Button
                variant="outline"
                className="w-full mb-4 group border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Hide Configuration' : 'Configure Now'}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-4 rounded-xl bg-black/40 border border-white/10`}>
                      {children}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </>
        )}
      </Card>
    </motion.div>
  );
}

function EmailPOPSMTPConfig() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionType, setConnectionType] = useState<'smtp' | 'pop3'>('smtp');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    smtpHost: '',
    smtpPort: '587',
    popHost: '',
    popPort: '995',
    name: ''
  });

  const handleConnect = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in email and password');
      return;
    }

    setLoading(true);
    
    try {
      // Simular conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('✅ Email connected!', {
        description: `${formData.email} configured successfully`
      });
      
      // Salvar no localStorage
      localStorage.setItem('email_config', JSON.stringify(formData));
      
    } catch (error) {
      toast.error('Connection error', {
        description: 'Check credentials and try again'
      });
    } finally {
      setLoading(false);
    }
  };

  const providers = [
    { name: 'Gmail', smtp: 'smtp.gmail.com', pop: 'pop.gmail.com', smtpPort: '587', popPort: '995' },
    { name: 'Outlook', smtp: 'smtp-mail.outlook.com', pop: 'outlook.office365.com', smtpPort: '587', popPort: '995' },
    { name: 'Yahoo', smtp: 'smtp.mail.yahoo.com', pop: 'pop.mail.yahoo.com', smtpPort: '587', popPort: '995' },
    { name: 'ProtonMail', smtp: 'smtp.protonmail.com', pop: 'pop.protonmail.com', smtpPort: '587', popPort: '1110' }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Setup - Providers */}
      <div>
        <Label className="text-sm text-zinc-400 mb-2 block">🚀 Quick Setup</Label>
        <div className="grid grid-cols-2 gap-2">
          {providers.map((provider) => (
            <Button
              key={provider.name}
              variant="outline"
              size="sm"
              className="justify-start border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20"
              onClick={() => {
                setFormData({
                  ...formData,
                  smtpHost: provider.smtp,
                  popHost: provider.pop,
                  smtpPort: provider.smtpPort,
                  popPort: provider.popPort
                });
                toast.success(`Configured for ${provider.name}`);
              }}
            >
              <Sparkles className="w-3 h-3 mr-2 text-indigo-400" />
              {provider.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Connection Type */}
      <div>
        <Label className="text-sm text-zinc-400 mb-2 block">📮 Connection Type</Label>
        <Tabs value={connectionType} onValueChange={(v) => setConnectionType(v as any)}>
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
            <TabsTrigger value="smtp" className="data-[state=active]:bg-indigo-600 text-zinc-400 data-[state=active]:text-white">SMTP (Send)</TabsTrigger>
            <TabsTrigger value="pop3" className="data-[state=active]:bg-indigo-600 text-zinc-400 data-[state=active]:text-white">POP3 (Receive)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Email & Password */}
      <div className="grid gap-4">
        <div>
          <Label htmlFor="email" className="text-zinc-300">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 bg-black/40 border-white/10 text-white placeholder:text-zinc-600"
          />
        </div>

        <div>
          <Label htmlFor="name" className="text-zinc-300">Display Name</Label>
          <Input
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 bg-black/40 border-white/10 text-white placeholder:text-zinc-600"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-zinc-300">Password / App Password</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pr-10 bg-black/40 border-white/10 text-white placeholder:text-zinc-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            💡 Use "App Password" for Gmail/Outlook (more secure)
          </p>
        </div>
      </div>

      {/* Server Settings */}
      {connectionType === 'smtp' ? (
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label htmlFor="smtpHost" className="text-zinc-300">SMTP Server</Label>
            <Input
              id="smtpHost"
              placeholder="smtp.gmail.com"
              value={formData.smtpHost}
              onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
              className="mt-1 bg-black/40 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <div>
            <Label htmlFor="smtpPort" className="text-zinc-300">Port</Label>
            <Input
              id="smtpPort"
              placeholder="587"
              value={formData.smtpPort}
              onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
              className="mt-1 bg-black/40 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label htmlFor="popHost" className="text-zinc-300">POP3 Server</Label>
            <Input
              id="popHost"
              placeholder="pop.gmail.com"
              value={formData.popHost}
              onChange={(e) => setFormData({ ...formData, popHost: e.target.value })}
              className="mt-1 bg-black/40 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <div>
            <Label htmlFor="popPort" className="text-zinc-300">Port</Label>
            <Input
              id="popPort"
              placeholder="995"
              value={formData.popPort}
              onChange={(e) => setFormData({ ...formData, popPort: e.target.value })}
              className="mt-1 bg-black/40 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
        </div>
      )}

      {/* Help Alert */}
      <div className="flex items-start gap-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm">
        <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-indigo-200">
          <p className="font-medium text-indigo-300">How to get App Password:</p>
          <ul className="list-disc list-inside text-xs mt-1 space-y-1 text-indigo-400/80">
            <li><strong>Gmail:</strong> Google Account → Security → App passwords</li>
            <li><strong>Outlook:</strong> Microsoft Account → Security → App passwords</li>
          </ul>
        </div>
      </div>

      {/* Connect Button */}
      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white border-0"
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Connect Email
          </>
        )}
      </Button>
    </div>
  );
}

export function ModernIntegrations() {
  const [emailStatus, setEmailStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [whatsappStatus, setWhatsappStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [linkedinStatus, setLinkedinStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [smsStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [testingEmail, setTestingEmail] = useState(false);

  // 📧 TESTE DE EMAIL
  const handleTestEmail = async () => {
    setTestingEmail(true);
    
    try {
      const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
      
      if (!currentUser.email) {
        toast.error('❌ User not found');
        return;
      }
      
      const success = await emailService.sendTestEmail(currentUser.email, currentUser.name);
      
      if (success) {
        toast.success('✅ Test email sent!', {
          description: `Check ${currentUser.email}`,
          duration: 8000
        });
      }
    } catch (error) {
      console.error('Error testing email:', error);
      toast.error('❌ Failed to send test email');
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header com animação */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-indigo-500" />
          </motion.div>
          <h2 className="text-3xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
            Integrations Hub
          </h2>
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-pink-500" />
          </motion.div>
        </div>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Connect your favorite tools in just a few clicks. Secure, fast, and reliable.
        </p>
      </motion.div>

      {/* 🚀 TESTE DE EMAIL - CARD DESTACADO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border border-indigo-500/30 shadow-2xl backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Email Connection Test</h3>
                    <p className="text-indigo-200 text-sm">Verify your Resend API configuration</p>
                  </div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/5">
                  <p className="text-sm text-indigo-100 mb-2">
                    📧 <strong>Configuration Status:</strong> Use the button below to test if Resend is working correctly.
                  </p>
                  <p className="text-xs text-indigo-300">
                    Ensure your <strong>RESEND_API_KEY</strong> is set in the environment variables.
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleTestEmail}
              disabled={testingEmail}
              className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-bold py-6 text-lg shadow-xl border-0"
            >
              {testingEmail ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending test email...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  📧 Send Test Email NOW
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* EMAIL */}
        <IntegrationCard
          icon={Mail}
          title="Email (POP/SMTP)"
          description="Connect email accounts to send and receive messages automatically"
          status={emailStatus}
          gradient="from-indigo-600 to-blue-600"
          accentColor="indigo"
        >
          <EmailPOPSMTPConfig />
        </IntegrationCard>

        {/* WHATSAPP */}
        <IntegrationCard
          icon={MessageSquare}
          title="WhatsApp Business"
          description="Connect your WhatsApp Business account for direct lead communication"
          status={whatsappStatus}
          gradient="from-emerald-600 to-green-600"
          accentColor="emerald"
        >
          <WhatsAppRealConnection 
            onConnected={(phone) => {
              setWhatsappStatus('connected');
              toast.success('WhatsApp connected!', { description: phone });
            }}
          />
        </IntegrationCard>

        {/* LINKEDIN */}
        <IntegrationCard
          icon={Linkedin}
          title="LinkedIn Sales Navigator"
          description="Access 900M+ LinkedIn profiles with advanced search and enrichment"
          status={linkedinStatus}
          gradient="from-blue-700 to-blue-900"
          accentColor="blue"
        >
          <LinkedInQRAuth 
            onConnected={(user) => {
              setLinkedinStatus('connected');
              toast.success('LinkedIn connected!', { description: user.name });
            }}
            onDisconnected={() => {
              setLinkedinStatus('disconnected');
            }}
          />
        </IntegrationCard>

        {/* INSTAGRAM - NOVO! */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <InstagramIntegration />
        </motion.div>

        {/* SMS */}
        <IntegrationCard
          icon={Phone}
          title="SMS Gateway"
          description="Send SMS messages to your leads in automated campaigns"
          status={smsStatus}
          gradient="from-pink-600 to-rose-600"
          accentColor="pink"
          comingSoon
        >
          <div className="text-center py-8">
            <p className="text-zinc-500">SMS gateway connection coming soon</p>
          </div>
        </IntegrationCard>
      </div>

      {/* 🌐 SOCIAL MEDIA SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pt-8 border-t border-white/10"
      >
        <SocialIntegrationsSettings />
      </motion.div>

      {/* 🔍 SEARCH APIs SECTION - REMOVIDO (agora está em Admin Console/Sistema) */}
    </div>
  );
}