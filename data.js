/* ============================================================
   Dados do plano
   Cada linha é um dia: leitura 1 ; leitura 2 ; salmos/provérbios/cântico
   ============================================================ */
const PLANO = `
GN 1-2;;SL 19
GN 3-4;;SL 104
GN 5-6;;SL 136
GN 7-9;;SL 1
GN 10-11;;SL 2
GN 12-13;JO 1-2;PR 1:1-7
GN 14-15;JO 3-4;PR 1:8-19
GN 16-17;JO 5-6;PR 1:20-33
GN 18-19;JO 7-8;PR 2:1-5
GN 20-21;JO 9-10;PR 2:6-8
GN 22-23;JO 11-12;PR 2:9-15
GN 24;JO 13-14;PR 2:16-19
GN 25-26;JO 15-16;PR 2:20-22
GN 27-28;JO 17-18;PR 3:1-4
GN 29-30;JO 19-20;PR 3:5-8
GN 31-32;JO 21-22;PR 3:9-12
GN 33-34;JO 23-24;PR 3:13-18
GN 35-36;JO 25-26;PR 3:19-24
GN 37;JO 27-28;PR 3:25-27
GN 38;JO 29-30;PR 3:28-32
GN 39-40;JO 31-32;PR 3:33-35
GN 41-42;JO 33-34;PR 4:1-9
GN 43-44;JO 35-36;PR 4:10-19
GN 45-46;JO 37-38;PR 4:20-27
GN 47-48;JO 39-40;SL 16
GN 49-50;JO 41-42;SL 17
EX 1-2;LV 1;SL 44
EX 3;LV 2-3;SL 45
EX 4-5;LV 4;SL 46
EX 6-7;LV 5;SL 47
EX 8;LV 6;SL 48
EX 9;LV 7;SL 49
EX 10-11;LV 8;SL 50
EX 12;LV 9;SL 114
EX 13-14;LV 10;SL 53
EX 15-16;LV 11;SL 71
EX 17-18;LV 12;SL 73
EX 19-20;LV 13;SL 74
EX 21;LV 14;SL 75
EX 22;LV 15;SL 76
EX 23;LV 16;SL 77
EX 24;LV 17-18;SL 78
EX 25-26;LV 19;SL 119:1-56
EX 27-28;LV 20;SL 119:57-120
EX 29;LV 21;SL 119:121-176
EX 30-31;LV 22;SL 115
EX 32;LV 23;SL 79
EX 33-34;LV 24;SL 80
EX 35-36;LV 25;SL 81
EX 37-38;LV 26;SL 82
EX 39-40;LV 27;SL 83
NM 1;DT 1;SL 84
NM 2;DT 2;SL 85
NM 3;DT 3;SL 87
NM 4;DT 4;SL 88
NM 5;DT 5;SL 90
NM 6;DT 6;SL 91
NM 7;DT 7;SL 92
NM 8-9;DT 8;SL 93
NM 10;DT 9;SL 10
NM 11;DT 10;SL 33
NM 12-13;DT 11;SL 94
NM 14;DT 12;SL 95
NM 15;DT 13-14;SL 96
NM 16;DT 15-16;SL 97
NM 17;DT 17-18;SL 98
NM 18;DT 19-20;SL 99
NM 19-20;DT 21;SL 100
NM 21;DT 22;SL 102
NM 22;DT 23;SL 105
NM 23;DT 24-25;SL 106
NM 24-25;DT 26;SL 107
NM 26;DT 27;SL 111
NM 27-28;DT 28;SL 112
NM 29-30;DT 29;SL 113
NM 31;DT 30;SL 116
NM 32;DT 31;SL 117
NM 33;DT 32;SL 118
NM 34;DT 33;SL 120
NM 35-36;DT 34;SL 121
JS 1-4;;SL 123
JS 5-7;;SL 125
JS 8-9;;SL 126
JS 10-11;;SL 128
JS 12-14;;SL 129
JS 15-18;;SL 130
JS 19-21;;SL 131
JS 22-24;;SL 132
JZ 1-3;RT 1;SL 133
JZ 4-5;RT 2;SL 134
JZ 6-8;RT 3;SL 135
JZ 9-11;RT 4;SL 137
JZ 12-15;;SL 146
JZ 16-18;;SL 147
JZ 19-21;;SL 148
1SM 1-2;;SL 149
1SM 3-5;;SL 150
1SM 6-8;;SL 86
JN 1-3;;PR 5:1-6
JN 4-6;;PR 5:7-14
JN 7-9;;PR 5:15-23
JN 10-12;;PR 6:1-5
JN 13-15;;PR 6:6-11
JN 16-18;;PR 6:12-15
JN 19-21;;PR 6:16-22
1SM 9-10;;PR 6:23-35
1SM 11-12;;SL 55
1SM 13-14;;SL 58
1SM 15-16;;SL 61
1SM 17;;SL 12
1SM 18-19;;SL 59
1SM 20;;SL 142
1SM 21-22;;SL 52
1SM 23;;SL 54
1SM 24;;SL 57
1SM 25;;SL 63
1SM 26;;SL 56
1SM 27-28;;SL 34
1SM 29-31;;SL 18
2SM 1;1CR 1;SL 13
2SM 2;1CR 2;SL 24
2SM 3;1CR 3-4;SL 25
2SM 4;1CR 5-6;SL 26
2SM 5;1CR 7-8;SL 27
2SM 6-7;1CR 9;SL 89
2SM 8;1CR 10-11;SL 60
2SM 9;1CR 12;SL 28
2SM 10;1CR 13;SL 31
2SM 11;1CR 14-15;SL 32
2SM 12;1CR 16;SL 51
2SM 13;1CR 17;SL 35
2SM 14;1CR 18;SL 14
2SM 15;1CR 19-20;SL 3
2SM 16;1CR 21;SL 15
2SM 17;1CR 22;SL 36
2SM 18;1CR 23;SL 37
2SM 19;1CR 24;SL 38
2SM 20;1CR 25;SL 39
2SM 21;1CR 26;SL 40
2SM 22;1CR 27;SL 41
2SM 23;1CR 28;SL 42
2SM 24;1CR 29;SL 30
1RS 1;2CR 1;SL 43
1RS 2;2CR 2-3;SL 62
1RS 3;2CR 4-5;SL 64
1RS 4;2CR 6;SL 65
1RS 5;2CR 7-8;SL 66
1RS 6;2CR 9;SL 4
1RS 7;ECL 1-2;SL 5
1RS 8;ECL 3-5;SL 6
1RS 9;ECL 6-7;SL 7
1RS 10;ECL 8-9;SL 8
1RS 11;ECL 10-12;SL 9
MC 1-2;;SL 11
MC 3-4;;SL 20
MC 5-6;;SL 21
MC 7-8;;SL 23
MC 9-10;;SL 29
MC 11-12;;SL 67
MC 13-14;;SL 68
MC 15-16;;SL 22
1RS 12;2CR 10-11;CT 1
1RS 13;2CR 12-13;CT 2
1RS 14;2CR 14-15;CT 3
1RS 15-16;2CR 16-17;CT 4
1RS 17-18;2CR 18-19;CT 5
1RS 19-20;2CR 20;CT 6
1RS 21;2CR 21-22;CT 7
1RS 22;2CR 23;CT 8
2RS 1;2CR 24;SL 69
2RS 2;2CR 25;SL 70
2RS 3;2CR 26-27;SL 72
2RS 4;2CR 28;SL 127
2RS 5;OS 1-3;SL 101
2RS 6-7;OS 4-7;SL 103
2RS 8;OS 8-10;SL 108
2RS 9;OS 11-14;SL 109
2RS 10;AM 1-3;SL 110
2RS 11-12;AM 4-6;SL 122
2RS 13-14;AM 7-9;SL 124
2RS 15;JON 1-4;SL 138
2RS 16;MQ 1-4;SL 139
2RS 17;MQ 5-7;SL 140
2RS 18;2CR 29;SL 141
2RS 19;2CR 30;SL 143
2RS 20;2CR 31;SL 144
2RS 21;2CR 32;SL 145
2RS 22;2CR 33;PR 7
2RS 23;2CR 34;PR 8:1-21
2RS 24;2CR 35;PR 8:22-36
2RS 25;2CR 36;PR 9:1-6
IS 1-2;TB 1-2;PR 9:7-12
IS 3-4;TB 3-4;PR 9:13-18
IS 5-6;TB 5-6;PR 10:1-4
IS 7-8;TB 7-9;PR 10:5-8
IS 9-10;TB 10-12;PR 10:9-12
IS 11-13;TB 13-14;PR 10:13-16
IS 14-15;JL 1-2;PR 10:17-20
IS 16-17;JL 3;PR 10:21-24
IS 18-20;NA 1-2;PR 10:25-28
IS 21-22;NA 3;PR 10:29-32
IS 23-24;HAB 1-2;PR 11:1-4
IS 25-27;HAB 3;PR 11:5-8
IS 28-29;SF 1-2;PR 11:9-12
IS 30-31;SF 3;PR 11:13-16
IS 32-33;BR 1-2;PR 11:17-20
IS 34-36;BR 3-4;PR 11:21-24
IS 37-38;BR 5-6;PR 11:25-28
IS 39-40;EZ 1;PR 11:29-31
IS 41-42;EZ 2-3;PR 12:1-4
IS 43-44;EZ 4-5;PR 12:5-8
IS 45-46;EZ 6-7;PR 12:9-12
IS 47-48;EZ 8-9;PR 12:13-16
IS 49-50;EZ 10-11;PR 12:17-20
IS 51-52;EZ 12-13;PR 12:21-24
IS 53-54;EZ 14-15;PR 12:25-28
IS 55-56;EZ 16;PR 13:1-4
IS 57-58;EZ 17-18;PR 13:5-8
IS 59-60;EZ 19;PR 13:9-12
IS 61-62;EZ 20;PR 13:13-16
IS 63-64;EZ 21-22;PR 13:17-20
IS 65;EZ 23-24;PR 13:21-25
IS 66;EZ 25-26;PR 14:1-4
JR 1;EZ 27;PR 14:5-8
JR 2;EZ 28;PR 14:9-12
JR 3;EZ 29-30;PR 14:13-16
JR 4;EZ 31-32;PR 14:17-20
JR 5;EZ 33;PR 14:21-24
JR 6;EZ 34-35;PR 14:25-28
JR 7;EZ 36;PR 14:29-32
JR 8;EZ 37-38;PR 14:33-35
JR 9;EZ 39;PR 15:1-4
JR 10-11;EZ 40;PR 15:5-8
JR 12-13;EZ 41-42;PR 15:9-12
JR 14-15;EZ 43-44;PR 15:13-16
JR 16-17;EZ 45-46;PR 15:17-20
JR 18-19;EZ 47-48;PR 15:21-24
JR 20-21;DN 1-2;PR 15:25-28
JR 22;DN 3;PR 15:29-33
JR 23;DN 4-5;PR 16:1-4
JR 24-25;DN 6-7;PR 16:5-8
JR 26-27;DN 8-9;PR 16:9-12
JR 28-29;DN 10-11;PR 16:13-16
JR 30;DN 12-13;PR 16:17-20
JR 31;DN 14;PR 16:21-24
JR 32;JDT 1-2;PR 16:25-28
JR 33-34;JDT 3-5;PR 16:29-33
JR 35-36;JDT 6-7;PR 17:1-4
JR 37-38;JDT 8-9;PR 17:5-8
JR 39-40;JDT 10-11;PR 17:9-12
JR 41-42;JDT 12-14;PR 17:13-16
JR 43-44;JDT 15-16;PR 17:17-20
JR 45-46;LM 1;PR 17:21-28
JR 47-48;LM 2;PR 18:1-4
JR 49-50;LM 3;PR 18:5-8
JR 51;LM 4-5;PR 18:9-12
JR 52;AB;PR 18:13-16
MT 1-4;;PR 18:17-20
MT 5-7;;PR 18:21-24
MT 8-10;;PR 19:1-4
MT 11-13;;PR 19:5-8
MT 14-17;;PR 19:9-12
MT 18-21;;PR 19:13-16
MT 22-24;;PR 19:17-20
MT 25-26;;PR 19:21-24
MT 27-28;;PR 19:25-29
ESD 1-2;AG 1-2;PR 20:1-3
ESD 3-4;ZC 1-3;PR 20:4-7
ESD 5-6;ZC 4-6;PR 20:8-11
ESD 7-8;ZC 7-8;PR 20:12-15
ESD 9-10;ZC 9-11;PR 20:16-19
NE 1-2;ZC 12-13;PR 20:20-22
NE 3;ZC 14;PR 20:23-26
NE 4-5;EST 11-12;PR 20:27-30
NE 6-7;EST 1-2;PR 21:1-4
NE 8;EST 3,13;PR 21:5-8
NE 9;EST 4,14;PR 21:9-12
NE 10;EST 15,6-7;PR 21:13-16
NE 11;EST 8,16;PR 21:17-20
NE 12;EST 9-11;PR 21:21-24
NE 13;ML 1-4;PR 21:25-28
1MC 1;SIR 1-3;PR 21:29-31
1MC 2;SIR 4-6;PR 22:1-4
1MC 3;SIR 7-9;PR 22:5-8
1MC 4;SIR 10-12;PR 22:9-12
1MC 5;SIR 13-15;PR 22:13-16
1MC 6;SIR 16-18;PR 22:17-21
1MC 7;SIR 19-21;PR 22:22-25
1MC 8;SIR 22-23;PR 22:26-29
1MC 9;SIR 24-25;PR 23:1-4
1MC 10;SIR 26-27;PR 23:5-8
1MC 11;SIR 28-29;PR 23:9-12
1MC 12;SIR 30-31;PR 23:13-16
1MC 13;SIR 32-33;PR 23:17-21
1MC 14;SIR 34-35;PR 23:22-25
1MC 15;SIR 36-37;PR 23:26-28
1MC 16;SIR 38-39;PR 23:29-35
2MC 1;SIR 40-41;PR 24:1-7
2MC 2;SIR 42-44;PR 24:8-9
2MC 3;SIR 45-46;PR 24:10-12
2MC 4;SIR 47-49;PR 24:13-16
2MC 5;SIR 50-51;PR 24:17-20
2MC 6;SB 1-2;PR 24:21-26
2MC 7;SB 3-4;PR 24:27-29
2MC 8;SB 5-6;PR 24:30-34
2MC 9;SB 7-8;PR 25:1-3
2MC 10;SB 9-10;PR 25:4-7
2MC 11;SB 11-12;PR 25:8-10
2MC 12;SB 13-14;PR 25:11-14
2MC 13;SB 15-16;PR 25:15-17
2MC 14;SB 17-18;PR 25:18-20
2MC 15;SB 19;PR 25:21-23
LC 1-2;;PR 25:24-26
LC 3-5;;PR 25:27-28
LC 6-8;;PR 26:1-3
LC 9-10;;PR 26:4-6
LC 11-12;;PR 26:7-9
LC 13-16;;PR 26:10-12
LC 17-19;;PR 26:13-16
LC 20-22:38;;PR 26:17-19
LC 22:39-24:50;;PR 26:20-23
AT 1;RM 1;PR 26:24-26
AT 2;RM 2-3;PR 26:27-28
AT 3;RM 4-5;PR 27:1-3
AT 4;RM 6-7;PR 27:4-6
AT 5;RM 8;PR 27:7-9
AT 6;RM 9-10;PR 27:10-12
AT 7;RM 11-12;PR 27:13-14
AT 8;RM 13-14;PR 27:15-17
AT 9;RM 15-16;PR 27:18-20
AT 10;1CO 1-2;PR 27:21-22
AT 11;1CO 3-4;PR 27:23-27
AT 12;1CO 5-6;PR 28:1-3
AT 13;1CO 7-8;PR 28:4-6
AT 14;1CO 9-10;PR 28:7-9
AT 15;1CO 11-12;PR 28:10-12
AT 16;1CO 13-14;PR 28:13-15
AT 17;1CO 15;PR 28:16-18
AT 18;1CO 16;PR 28:19-21
AT 19;2CO 1-2;PR 28:22-24
AT 20;2CO 3-5;PR 28:25-28
AT 21;2CO 6-8;PR 29:1-4
AT 22;2CO 9-11;PR 29:5-7
AT 23;2CO 12-13;PR 29:8-11
AT 24;GL 1-3;PR 29:12-14
AT 25;GL 4-6;PR 29:15-17
AT 26;EF 1-3;PR 29:18-21
AT 27;EF 4-6;PR 29:22-24
AT 28;FL 1-2;PR 29:25-27
TG 1-2;FL 3-4;PR 30:1-6
TG 3-5;CL 1-2;PR 30:7-9
1PD 1-2;CL 3-4;PR 30:10-14
1PD 3-5;1TS 1-3;PR 30:15-16
2PD 1-3;1TS 4-5;PR 30:17-19
1JO 1-3;2TS 1-3;PR 30:20-23
1JO 4-5;1TM 1-3;PR 30:24-28
2JO+3JO;1TM 4-6;PR 30:29-33
JD;2TM 1-2;PR 31:1-7
AP 1-3;2TM 3-4;PR 31:8-9
AP 4-7;TT 1-3;PR 31:10-15
AP 8-11;FM;PR 31:16-18
AP 12-14;HEB 1-4;PR 31:19-22
AP 15-17;HEB 5-8;PR 31:23-25
AP 18-20;HEB 9-10;PR 31:26-29
AP 21-22;HEB 11-13;PR 31:30-31
`;

const LIVROS = {
  GN: "Gênesis", EX: "Êxodo", LV: "Levítico", NM: "Números", DT: "Deuteronômio",
  JS: "Josué", JZ: "Juízes", RT: "Rute", "1SM": "1 Samuel", "2SM": "2 Samuel",
  "1RS": "1 Reis", "2RS": "2 Reis", "1CR": "1 Crônicas", "2CR": "2 Crônicas",
  ESD: "Esdras", NE: "Neemias", TB: "Tobias", JDT: "Judite", EST: "Ester",
  "1MC": "1 Macabeus", "2MC": "2 Macabeus", JO: "Jó", SL: "Salmo", PR: "Provérbios",
  ECL: "Eclesiastes", CT: "Cântico dos Cânticos", SB: "Sabedoria", SIR: "Eclesiástico",
  IS: "Isaías", JR: "Jeremias", LM: "Lamentações", BR: "Baruc", EZ: "Ezequiel",
  DN: "Daniel", OS: "Oseias", JL: "Joel", AM: "Amós", AB: "Abdias", JON: "Jonas",
  MQ: "Miqueias", NA: "Naum", HAB: "Habacuc", SF: "Sofonias", AG: "Ageu",
  ZC: "Zacarias", ML: "Malaquias", MT: "Mateus", MC: "Marcos", LC: "Lucas",
  JN: "João", AT: "Atos", RM: "Romanos", "1CO": "1 Coríntios", "2CO": "2 Coríntios",
  GL: "Gálatas", EF: "Efésios", FL: "Filipenses", CL: "Colossenses",
  "1TS": "1 Tessalonicenses", "2TS": "2 Tessalonicenses", "1TM": "1 Timóteo",
  "2TM": "2 Timóteo", TT: "Tito", FM: "Filêmon", HEB: "Hebreus", TG: "Tiago",
  "1PD": "1 Pedro", "2PD": "2 Pedro", "1JO": "1 João", "2JO": "2 João",
  "3JO": "3 João", JD: "Judas", AP: "Apocalipse"
};

// Os 14 livros narrativos da Great Adventure Bible Timeline
const NARRATIVOS = new Set(["GN","EX","NM","JS","JZ","1SM","2SM","1RS","2RS","ESD","NE","1MC","LC","AT"]);

export const SECOES = [
  { id: "e1",  tipo: "era", num: "I",    nome: "Mundo Primitivo",           de: 1,   ate: 5,   cor: "#3e8e6a", desc: "Da criação ao dilúvio e à torre de Babel." },
  { id: "e2",  tipo: "era", num: "II",   nome: "Patriarcas",                de: 6,   ate: 26,  cor: "#c8982e", desc: "Abraão, Isaque, Jacó e José, com o sofrimento de Jó." },
  { id: "e3",  tipo: "era", num: "III",  nome: "Egito e Êxodo",             de: 27,  ate: 51,  cor: "#c0432c", desc: "A libertação da escravidão, a aliança no Sinai e a Lei." },
  { id: "e4",  tipo: "era", num: "IV",   nome: "Peregrinação no Deserto",   de: 52,  ate: 80,  cor: "#b58a5b", desc: "Quarenta anos a caminho da terra prometida." },
  { id: "e5",  tipo: "era", num: "V",    nome: "Conquista e Juízes",        de: 81,  ate: 98,  cor: "#7c5ba6", desc: "A entrada em Canaã e os libertadores de Israel." },
  { id: "m1",  tipo: "marco", nome: "Marco messiânico: Evangelho de João",   de: 99,  ate: 105, cor: "#c9a54a", desc: "Uma pausa na caminhada para encontrar Cristo, o centro de toda a história." },
  { id: "e6",  tipo: "era", num: "VI",   nome: "Reino Unido",               de: 106, ate: 153, cor: "#2f5fb0", desc: "Samuel, Saul, Davi e Salomão: Israel se torna um reino." },
  { id: "m2",  tipo: "marco", nome: "Marco messiânico: Evangelho de Marcos", de: 154, ate: 161, cor: "#c9a54a", desc: "Cristo no centro da história, contado de forma breve e direta." },
  { id: "e7",  tipo: "era", num: "VII",  nome: "Reino Dividido",            de: 162, ate: 183, cor: "#4e9aa8", desc: "Dois reinos separados e a voz dos profetas." },
  { id: "e8",  tipo: "era", num: "VIII", nome: "Exílio",                    de: 184, ate: 257, cor: "#6b6f86", desc: "A queda de Jerusalém, o cativeiro e a esperança anunciada pelos profetas." },
  { id: "m3",  tipo: "marco", nome: "Marco messiânico: Evangelho de Mateus", de: 258, ate: 266, cor: "#c9a54a", desc: "O Messias prometido aos profetas chega a seu povo." },
  { id: "e9",  tipo: "era", num: "IX",   nome: "Retorno",                   de: 267, ate: 281, cor: "#7fa14a", desc: "A volta do exílio e a reconstrução do Templo e dos muros." },
  { id: "e10", tipo: "era", num: "X",    nome: "Revolta dos Macabeus",      de: 282, ate: 312, cor: "#9b3a5e", desc: "Fidelidade sob perseguição e a sabedoria dos sábios de Israel." },
  { id: "e11", tipo: "era", num: "XI",   nome: "Cumprimento Messiânico",    de: 313, ate: 321, cor: "#d9b24c", desc: "A vida, a morte e a ressurreição de Jesus, segundo Lucas." },
  { id: "e12", tipo: "era", num: "XII",  nome: "A Igreja",                  de: 322, ate: 365, cor: "#e0702e", desc: "Atos, as cartas dos apóstolos e o Apocalipse." }
];

/* ============================================================
   Montagem dos dados
   ============================================================ */
function formatarRef(texto) {
  return texto.replace(/-/g, "–").replace(/,(?=\S)/g, ", ");
}

function lerLeitura(texto, indiceColuna) {
  const partes = texto.split("+").map(p => p.trim());
  const codigos = partes.map(p => p.split(" ")[0]);
  const rotulo = partes.map(p => {
    const codigo = p.split(" ")[0];
    const resto = p.slice(codigo.length).trim();
    return LIVROS[codigo] + (resto ? " " + formatarRef(resto) : "");
  }).join(", ");
  return {
    rotulo,
    narrativo: codigos.some(c => NARRATIVOS.has(c)),
    sabedoria: indiceColuna === 2
  };
}

export const DIAS = PLANO.trim().split("\n").map((linha, i) => {
  const leituras = linha.split(";")
    .map((texto, col) => texto ? lerLeitura(texto, col) : null)
    .filter(Boolean);
  const secao = SECOES.find(s => i + 1 >= s.de && i + 1 <= s.ate);
  return { n: i + 1, secao, leituras, cheio: (1 << leituras.length) - 1 };
});
