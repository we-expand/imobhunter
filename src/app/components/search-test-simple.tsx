/**
 * TESTE SIMPLES - Para debugar o problema de Badge
 */
import React from 'react';
import { Badge } from './ui/badge';

export function SearchTestSimple() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Teste Simples</h1>
      <Badge>Teste Badge 1</Badge>
      <Badge variant="secondary">Teste Badge 2</Badge>
      <Badge variant="outline">Teste Badge 3</Badge>
      <p className="mt-4">Se você está vendo isto, o Badge funciona!</p>
    </div>
  );
}
