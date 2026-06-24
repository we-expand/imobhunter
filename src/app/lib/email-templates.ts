export const confirmationEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirme seu email - ImobHunter</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; }
    .logo { color: white; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .h1 { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 16px; }
    .text { font-size: 16px; color: #4b5563; margin-bottom: 24px; }
    .button { display: inline-block; background-color: #4f46e5; color: white; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin-top: 10px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2); }
    .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    .link { color: #4f46e5; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">ImobHunter</h1>
    </div>
    <div class="content">
      <h2 class="h1">Bem-vindo(a) ao futuro imobiliário!</h2>
      <p class="text">Olá,</p>
      <p class="text">Falta apenas um passo para você acessar a plataforma de inteligência imobiliária mais avançada do mercado.</p>
      <p class="text">Clique no botão abaixo para confirmar sua conta e começar:</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirmar Minha Conta</a>
      </div>
      
      <p class="text" style="font-size: 14px; margin-top: 20px;">Se o botão não funcionar, copie e cole este link no seu navegador:<br>
      <span style="color: #6b7280; word-break: break-all;">{{ .ConfirmationURL }}</span></p>
    </div>
    <div class="footer">
      <p>&copy; 2024 ImobHunter AI. Todos os direitos reservados.</p>
      <p>Este email foi enviado automaticamente. Por favor não responda.</p>
    </div>
  </div>
</body>
</html>
`;
