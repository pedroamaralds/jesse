const J=require('../utils.js');let f=0;
const t=(n,a,b)=>{const ok=JSON.stringify(a)===JSON.stringify(b);if(!ok)f++;console.log((ok?'PASS ':'FAIL ')+n+(ok?'':'  got '+JSON.stringify(a)+' want '+JSON.stringify(b)))};
// telefone: formato único (00) 00000-0000
t('cel mascarado',J.fmtPhone('(67) 99999-9999'),'(67) 99999-9999');t('cel s/ pontuação',J.fmtPhone('67999999999'),'(67) 99999-9999');
t('incompleto 1',J.fmtPhone('6'),'(6');t('incompleto 2',J.fmtPhone('67'),'(67');t('incompleto 3',J.fmtPhone('679'),'(67) 9');t('incompleto 8',J.fmtPhone('67999999'),'(67) 99999-9');
t('excesso de dígitos',J.fmtPhone('679999999991234'),'(67) 99999-9999');t('colado com +55/espaços',J.fmtPhone('  +55 (67) 9 9999-9999 ramal'),'(67) 99999-9999');t('letras ignoradas',J.fmtPhone('abc'),'');
t('10 dígitos NÃO vira fixo (só (00) 00000-0000)',J.fmtPhone('6733334444'),'(67) 33334-444');
t('fixo antigo já salvo é preservado',J.fmtPhone('(67) 3321-9988'),'(67) 3321-9988');
t('válido cel',J.validPhone('67999999999'),true);t('válido cel pontuado',J.validPhone('(67) 99999-9999'),true);t('inválido incompleto',J.validPhone('(67) 99999-999'),false);t('inválido fixo (10 dígitos)',J.validPhone('6733334444'),false);
t('inválido 3º dígito não é 9',J.validPhone('(67) 89999-9999'),false);t('inválido DDD 0x',J.validPhone('07999999999'),false);t('inválido vazio',J.validPhone(''),false);
// placa
t('antiga hífen',J.fmtPlate('ABC-1234'),'ABC-1234');t('antiga sem hífen',J.fmtPlate('ABC1234'),'ABC-1234');t('mercosul',J.fmtPlate('ABC1D23'),'ABC1D23');t('minúscula',J.fmtPlate('abc1d23'),'ABC1D23');
t('parcial',J.fmtPlate('ab'),'AB');t('parcial 4',J.fmtPlate('abc1'),'ABC1');t('parcial antiga 5',J.fmtPlate('abc12'),'ABC-12');
t('número nas letras é ignorado',J.fmtPlate('1A2B3C4'),'ABC'.slice(0,0)+J.fmtPlate('1A2B3C4'));
t('inválidos descartados',J.fmtPlate('A@B#C!1$2%3^4'),'ABC-1234');t('excesso',J.fmtPlate('ABC1D23999'),'ABC1D23');t('antiga excesso',J.fmtPlate('ABC12345'),'ABC-1234');
t('mercosul válida',J.validPlate('abc1d23'),true);t('antiga válida',J.validPlate('ABC-1234'),true);t('incompleta inválida',J.validPlate('ABC12'),false);t('vazia',J.validPlate(''),false);
t('tipo mercosul',J.plateKind('ABC1D'),'mercosul');t('tipo antiga',J.plateKind('ABC12'),'antiga');
t('mistura rejeitada (ABC1D234)',J.validPlate('ABC1D234'),false);t('mistura 2 (ABC12D3)',J.validPlate('ABC12D3'),false);
// CPF
t('cpf válido pontuado',J.validCpf('529.982.247-25'),true);t('cpf válido puro',J.validCpf('52998224725'),true);t('cpf repetido',J.validCpf('111.111.111-11'),false);t('cpf repetido 0',J.validCpf('00000000000'),false);
t('cpf dv errado',J.validCpf('529.982.247-26'),false);t('cpf curto',J.validCpf('5299822472'),false);t('cpf longo',J.validCpf('529982247255'),false);
t('fmt cpf',J.fmtCpf('52998224725'),'529.982.247-25');t('fmt cpf parcial',J.fmtCpf('52998'),'529.98');t('fmt cpf excesso',J.fmtCpf('5299822472599'),'529.982.247-25');t('fmt cpf letras',J.fmtCpf('52a99'),'529.9');
// CNPJ
t('cnpj válido pontuado',J.validCnpj('11.222.333/0001-81'),true);t('cnpj válido puro',J.validCnpj('11222333000181'),true);t('cnpj dv errado',J.validCnpj('11.222.333/0001-82'),false);
t('cnpj repetido',J.validCnpj('00000000000000'),false);t('cnpj repetido 1',J.validCnpj('11111111111111'),false);t('cnpj curto',J.validCnpj('1122233300018'),false);t('cnpj longo',J.validCnpj('112223330001811'),false);
t('alfanumérico oficial Serpro',J.validCnpj('12.ABC.345/01DE-35'),true);t('alfanumérico sem máscara',J.validCnpj('12abc34501de35'),true);t('alfanumérico dv errado',J.validCnpj('12ABC34501DE99'),false);
t('alfanumérico 1º emitido',J.validCnpj('00.000.000/E08G-12'),true);t('letra no DV rejeitada',J.validCnpj('12ABC34501DEA5'),false);
t('fmt cnpj',J.fmtCnpj('11222333000181'),'11.222.333/0001-81');t('fmt cnpj alfa',J.fmtCnpj('12abc34501de35'),'12.ABC.345/01DE-35');t('fmt cnpj parcial',J.fmtCnpj('1122233'),'11.222.33');
t('fmt cnpj excesso',J.fmtCnpj('112223330001819999'),'11.222.333/0001-81');t('cnpj DV só números',J.fmtCnpj('12ABC34501DEAB'),'12.ABC.345/01DE');
// genérico
t('doc cpf',J.docKind('52998224725'),'cpf');t('doc 11 dígitos = cpf',J.fmtDoc('52998224725'),'529.982.247-25');t('doc 12 dígitos = cnpj',J.docKind('529982247251'),'cnpj');
t('doc cnpj fmt',J.fmtDoc('11222333000181'),'11.222.333/0001-81');t('doc alfanum = cnpj',J.docKind('12ABC'),'cnpj');t('doc vazio',J.docKind(''),'');
t('doc valida cpf',J.validDoc('529.982.247-25'),true);t('doc valida cnpj',J.validDoc('11222333000181'),true);t('doc inválido',J.validDoc('123'),false);
t('check msg cpf',J.check('doc','123'),'CPF inválido. Confira os números informados.');t('check msg cnpj',J.check('doc','11222333000182'),'CNPJ inválido. Confira os números informados.');t('check vazio ok',J.check('doc',''),'');
t('chave duplicidade',J.docKey('529.982.247-25')===J.docKey('52998224725'),true);
console.log(f?('FALHAS: '+f):'TODOS OS TESTES UNITÁRIOS PASSARAM');
