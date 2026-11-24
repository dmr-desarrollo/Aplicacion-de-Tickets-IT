
export interface HistoryEntry {
  date: string;
  action: string;
  hours: number;
  minutes: number;
}

export interface Activity {
  id: string;
  code: string;
  requester: string;
  registrationDate: string;
  dueDate: string;
  client: string;
  clientType: 'interno' | 'externo';
  priority: 'alta' | 'media' | 'baja';
  status: 'pendiente' | 'Completada';
  description: string;
  history: HistoryEntry[];
}

export interface Client {
  id: string;
  name: string;
  technicalDetail?: string;
  contact?: string;
}

export const initialClients: Client[] = [
    { id: '1', name: 'AKZonobel', technicalDetail: '', contact: 'Ing. Gerardo Arambillete' },
    { id: '2', name: 'Frigorífico Modelo', technicalDetail: '', contact: 'José Rodríguez shaw' },
    { id: '3', name: 'Meca Asociados', technicalDetail: '', contact: '' },
    { id: '4', name: 'Fate Sistema', technicalDetail: 'software facturación, desarrollo de software vertical: facturar 600 clientes, siaf, contratista forestal clientes para IPM, imprimir en calle con el bluetooth, desarrollo a la medida, gimnasio, software para salas. factura impresión, están dispuesto con horas de programación , han comprado 30 impresoras térmicas, miltech, desde Android all in one con USB y por red antes le compraban a ', contact: '' },
    { id: '5', name: 'scanntech', technicalDetail: '', contact: 'pienica +598 98 835 596' },
    { id: '6', name: 'GIGP', technicalDetail: 'wms, tambien proyecto de trazabilidad de tubos de oxigenos', contact: 'Alexander Cardozo' },
    { id: '7', name: 'Air Liquide', technicalDetail: '', contact: '' },
    { id: '8', name: 'Soluciones Cloud', technicalDetail: 'aplicación en Android, gestión punto de venta, USB y Ethernet, usan impresora miltech, union, secuencia escape', contact: 'gustavo' },
    { id: '9', name: 'DISCO', technicalDetail: '', contact: '' },
    { id: '10', name: 'DMR', technicalDetail: '', contact: '' },
    { id: '11', name: 'TATA', technicalDetail: '', contact: '' },
    { id: '12', name: 'San Roque', technicalDetail: '', contact: '' },
    { id: '13', name: 'Storage Compat', technicalDetail: '', contact: '' },
    { id: '14', name: 'Supermercados U', technicalDetail: '', contact: '' },
    { id: '15', name: 'Vessena', technicalDetail: 'Industria quimica', contact: '' },
    { id: '16', name: 'Inca', technicalDetail: '', contact: '' },
    { id: '17', name: 'Junta Departamental de Montevideo', technicalDetail: '', contact: '' },
    { id: '18', name: 'Microfin', technicalDetail: '', contact: 'diego' },
    { id: '19', name: 'Sarubi', technicalDetail: '', contact: 'diego.bentancort@microfin.com.uy' },
    { id: '20', name: 'CDO', technicalDetail: '', contact: '97248 005' },
    { id: '21', name: 'Durulte', technicalDetail: '', contact: '' },
    { id: '22', name: 'Office 2000', technicalDetail: '', contact: '' },
    { id: '23', name: 'Panifique', technicalDetail: '', contact: '' },
    { id: '24', name: 'Negri Cuartino', technicalDetail: '', contact: '' },
    { id: '25', name: 'Gustavo Zaltzman', technicalDetail: '', contact: '' },
    { id: '26', name: 'Carlos Escobar', technicalDetail: 'dmrprint', contact: '09970822 enrique' },
    { id: '27', name: 'Guarino', technicalDetail: '', contact: 'roberto Balderrin' },
    { id: '28', name: 'Star Micronics', technicalDetail: '', contact: '' },
    { id: '29', name: 'SuperMax', technicalDetail: 'Cadena de supermercados', contact: 'Marcelo Gabriele' },
    { id: '30', name: 'Unitech', technicalDetail: 'proveedor de equipos', contact: 'jose ivan gonzales' },
    { id: '31', name: 'Alexander Cardozo', technicalDetail: '', contact: '' },
    { id: '32', name: 'BPS', technicalDetail: '', contact: '' },
    { id: '33', name: 'eximia', technicalDetail: 'el cliente tiene dos impresoras, la impresora TSC funciona', contact: '' },
    { id: '34', name: 'Las Piedras', technicalDetail: 'frigorifico importante para Lipiner', contact: '' },
    { id: '35', name: 'Zsoftware', technicalDetail: '', contact: 'Susana Baridón' },
    { id: '36', name: 'MATILDA', technicalDetail: '', contact: 'Gonzalo Lasa' },
    { id: '37', name: 'Latu', technicalDetail: '', contact: '' },
    { id: '38', name: 'SAPP', technicalDetail: 'Jefe departamento IT', contact: 'Jorge Fernandez' },
    { id: '39', name: 'Netson', technicalDetail: 'Proveedor para mantenimientos de impresoras', contact: '' },
    { id: '40', name: 'Bixolon', technicalDetail: 'proveedor de equipos', contact: 'Leobardo Gomez Valenzuela' },
    { id: '41', name: 'Id Retail', technicalDetail: 'Distribuidor', contact: 'Nicolas' },
    { id: '42', name: 'Teledata', technicalDetail: 'Empresa de telecomunicaciones y networking', contact: 'David Genta' },
    { id: '43', name: 'The Best Fsherman', technicalDetail: '', contact: 'Natalia' },
    { id: '44', name: 'Tienda Inglesa', technicalDetail: '', contact: 'Juan Ignacio Silva' },
    { id: '45', name: 'Quesos Maia', technicalDetail: 'Frigorifico de quesos', contact: 'Monica Olivo' },
    { id: '46', name: 'Pereira Capdevila', technicalDetail: '', contact: 'Gaston Sobot' },
    { id: '47', name: 'MAPA', technicalDetail: 'Tecnico de MAPA', contact: 'Javier Franca' },
    { id: '48', name: 'Itzaina', technicalDetail: '', contact: '' },
    { id: '49', name: 'SOMICAR S.A', technicalDetail: 'frigorifico compran PM45', contact: 'Manuel' },
    { id: '50', name: 'naranjo', technicalDetail: 'empresa de distribucion de alimentos', contact: 'Mayra Ferreira' },
    { id: '51', name: 'Datasur TecnoStore', technicalDetail: '', contact: 'Marcelo Viña' },
    { id: '52', name: 'La Red Informatica SRL', technicalDetail: '', contact: 'Enrique Alonzo' },
    { id: '53', name: 'SAINT', technicalDetail: 'Empresa que trabaja con Sap', contact: 'MALCOM 096651877' },
    { id: '54', name: 'Mercado Digital', technicalDetail: '', contact: 'Adriana Correa' },
    { id: '55', name: 'PETTENUZZO HNOS', technicalDetail: 'Cliente 7927 -', contact: 'Enzo 099 920 721' },
    { id: '56', name: 'Urteil', technicalDetail: '', contact: 'urteil' },
    { id: '57', name: 'Drogeria Montevideo', technicalDetail: '', contact: 'Joaquin Garibaldi' },
    { id: '58', name: 'Alejandro Martinez', technicalDetail: '', contact: '' },
    { id: '59', name: 'DELGON', technicalDetail: '', contact: 'mario' },
    { id: '60', name: 'PEPEGANGA', technicalDetail: '94020242', contact: 'Federico, usaurio de deppsito' },
    { id: '61', name: 'WIS', technicalDetail: 'Empresa de software', contact: '92000035' },
    { id: '62', name: 'ANTEL', technicalDetail: '', contact: '' },
    { id: '63', name: 'SUPERMERCADO EL VASCO', technicalDetail: 'EDUARDO OTEGUY', contact: '' },
    { id: '64', name: 'El Vasco', technicalDetail: '', contact: '' },
    { id: '65', name: 'Bimbo', technicalDetail: 'Cliente de ID Retail', contact: 'Eduardo 096882930' },
    { id: '66', name: 'Fragusan SRL', technicalDetail: 'Fernando Cena', contact: '+598 99 425 232' },
    { id: '67', name: 'Barraca Giordano', technicalDetail: 'Rodolfo Giordano', contact: '5,98099E+11' },
    { id: '68', name: 'San Jacinto', technicalDetail: 'SERGIO', contact: '+598 98 812 954' },
    { id: '69', name: 'DILETO S.R.L', technicalDetail: 'DIEGO TOLEDO', contact: '93595475' },
    { id: '70', name: 'Calibraciones SRL', technicalDetail: 'fabrizio', contact: '99744471' },
    { id: '71', name: 'SIGE SOFTWARE', technicalDetail: 'Roberto', contact: '99758595' },
    { id: '72', name: 'SPEFAR', technicalDetail: 'Edison Olazabal', contact: '2336 7440 Ext. 123' },
    { id: '73', name: 'PUNTO COM', technicalDetail: 'Diego', contact: '098574709' },
    { id: '74', name: 'kroser', technicalDetail: '', contact: '' },
    { id: '75', name: 'gecos', technicalDetail: '', contact: '' },
    { id: '76', name: 'Bambu', technicalDetail: 'Daniel', contact: '93503887' },
    { id: '77', name: 'Matias Da Misa', technicalDetail: 'Matias Da Misa', contact: '+598 92 315 158' },
    { id: '78', name: 'Veltomar SA', technicalDetail: 'Andrea Larrosa', contact: '23239909' },
    { id: '79', name: 'Acosta Reyes Anibal', technicalDetail: 'Acosta Reyes Anibal', contact: '98955371' },
    { id: '80', name: 'Macrosoft', technicalDetail: 'Fernando Rey', contact: '99661947' },
    { id: '81', name: 'ELTRICA fruta y verdura', technicalDetail: 'Daniel Tricánico', contact: '99638927' },
    { id: '82', name: 'Daniel De Sousa', technicalDetail: 'Daniel De Sousa', contact: '99745549' },
    { id: '83', name: 'Montevideo Bakery', technicalDetail: 'Montevideo Bakery', contact: '91655969' },
    { id: '84', name: 'RAQUEL DE CARVALHO', technicalDetail: 'RAQUEL DE CARVALHO', contact: '98042904' },
    { id: '85', name: 'Super bambu', technicalDetail: 'Super bambu', contact: '95459007' },
    { id: '86', name: 'Macri calzados', technicalDetail: 'Alexander cardozo', contact: '96655202' },
    { id: '87', name: 'Stella Tosetto y Ana Tosetto', technicalDetail: 'Stella Tosetto y Ana Tosetto', contact: '94533828 - 94617777' },
    { id: '88', name: 'insis', technicalDetail: '', contact: '' },
    { id: '89', name: 'COSTASUR DISTRIBUCIONES', technicalDetail: '', contact: '' },
    { id: '90', name: 'Frigorifico Sirsil', technicalDetail: 'Javier', contact: '98113516' },
    { id: '91', name: 'Ottonello', technicalDetail: 'Jose luis', contact: '98451915' },
    { id: '92', name: 'Cuatro Hermanas SRL', technicalDetail: 'Cuatro Hermanas SRL', contact: '98549416' },
    { id: '93', name: 'Chacal', technicalDetail: 'Franco Queriquian', contact: '95971214' },
    { id: '94', name: 'Insis', technicalDetail: 'Virginia Operti', contact: '24099203' },
    { id: '95', name: 'J y M GAS', technicalDetail: 'Mónica Pérez López', contact: '098016787 - 98 945 528' },
    { id: '96', name: 'Distribuidora de Plata', technicalDetail: 'Rafael Urti', contact: '98560824' },
    { id: '97', name: 'DISTRAVI SA', technicalDetail: 'DISTRAVI SA', contact: '22090622-22032927-095097619' },
    { id: '98', name: 'Alto Control', technicalDetail: 'Alto Control', contact: '29016323 interno-3 soporte tecnico' },
    { id: '99', name: 'VAUPENTRAS LTDA', technicalDetail: 'Sandra', contact: '097 105 473' },
    { id: '100', name: 'Almena', technicalDetail: 'Federico Acuña', contact: 'facuna@almena.com.uy' },
    { id: '101', name: 'Los Emires SAS', technicalDetail: 'marilene', contact: '91003004' },
    { id: '102', name: 'Distribuidora Pereiro SAS', technicalDetail: '', contact: '99662461' },
    { id: '103', name: 'Teosan', technicalDetail: 'Juan Silvera', contact: '97319477' },
    { id: '104', name: 'jorge martinez', technicalDetail: '', contact: '96412424 - 096412424' },
    { id: '105', name: 'Ana Oggiani', technicalDetail: '', contact: '' },
    { id: '106', name: 'David García', technicalDetail: '', contact: '' },
    { id: '107', name: 'Maximiliano Sosa', technicalDetail: '', contact: '' },
    { id: '108', name: 'Gerardo Turnes', technicalDetail: '', contact: '' },
    { id: '109', name: 'Enrique Nicoletti', technicalDetail: '', contact: '' },
    { id: '110', name: 'Nadia Machado', technicalDetail: '', contact: '' },
    { id: '111', name: 'Nicolas canabe', technicalDetail: '', contact: '' },
    { id: '112', name: 'Carlos Matteo', technicalDetail: '', contact: '' },
    { id: '113', name: 'Bibiana Medina', technicalDetail: '', contact: '' },
    { id: '114', name: 'José Márquez', technicalDetail: '', contact: '' },
    { id: '115', name: 'Jessica Erlan', technicalDetail: '', contact: '' },
    { id: '116', name: 'Gabriel Gette', technicalDetail: '', contact: '' },
    { id: '117', name: 'Marcelo Camejo', technicalDetail: '', contact: '' },
    { id: '118', name: 'José Figueroa', technicalDetail: '', contact: '' },
    { id: '119', name: 'Oscar Enrique', technicalDetail: '', contact: '' },
    { id: '120', name: 'Lorena Magallanes', technicalDetail: '', contact: '' },
    { id: '121', name: 'Viviana Ferreira', technicalDetail: '', contact: '' },
    { id: '122', name: 'Natalia Mentaste', technicalDetail: '', contact: '' },
    { id: '123', name: 'Mariana Laguna', technicalDetail: '', contact: '' },
    { id: '124', name: 'Javier Vicente', technicalDetail: '', contact: '' },
    { id: '125', name: 'Tatiana Leal', technicalDetail: '', contact: '' },
    { id: '126', name: 'Daniel Alvarez', technicalDetail: '', contact: '' },
    { id: '127', name: 'Brenda Rodriguez', technicalDetail: '', contact: '' },
    { id: '128', name: 'Fernando Pinella', technicalDetail: '', contact: '' },
    { id: '129', name: 'Christian Fort', technicalDetail: '', contact: '' },
    { id: '130', name: 'Shanon Plaza', technicalDetail: '', contact: '' },
    { id: '131', name: 'Igacio Villanueva', technicalDetail: '', contact: '' },
    { id: '132', name: 'Sebastian Cabaleiro', technicalDetail: '', contact: '' },
    { id: '133', name: 'Virginia Pera', technicalDetail: '', contact: '' },
    { id: '134', name: 'Yennifer Ventancourte', technicalDetail: '', contact: '' },
    { id: '135', name: 'Paula Nuñez', technicalDetail: '', contact: '' },
    { id: '136', name: 'Manuel Leibner', technicalDetail: '', contact: '' },
    { id: '137', name: 'Gonzalo reyes', technicalDetail: '', contact: '' },
    { id: '138', name: 'sofia turnes', technicalDetail: '', contact: '' },
    { id: '139', name: 'Guillermo García', technicalDetail: '', contact: '' },
    { id: '140', name: 'Nestor Espiga', technicalDetail: '', contact: '' },
    { id: '141', name: 'Edgardo Villanueva', technicalDetail: '', contact: '' },
    { id: '142', name: 'Gonzalo Dematte', technicalDetail: '', contact: '' },
    { id: '143', name: 'Peter Vasquez', technicalDetail: '', contact: '' },
    { id: '144', name: 'Clever', technicalDetail: '', contact: '' },
    { id: '145', name: 'Heidy Carrara', technicalDetail: '', contact: '' },
    { id: '146', name: 'DHAYANNA GUTIERREZ', technicalDetail: '', contact: '' },
    { id: '147', name: 'Martin Queirolo', technicalDetail: '', contact: '' },
    { id: '148', name: 'Alejandro Gonzalez', technicalDetail: '', contact: '' },
    { id: '149', name: 'Maximiliano Viera', technicalDetail: '', contact: '' },
    { id: '150', name: 'empleados produccion', technicalDetail: '', contact: '' },
    { id: '151', name: 'Susy Trigo', technicalDetail: '', contact: '' },
    { id: '152', name: 'Anpacar SRL', technicalDetail: 'Carlos Benitez', contact: '+598 99 269 513' },
    { id: '153', name: 'VARTQUEZ KAVEDJIAN', technicalDetail: 'VARTQUEZ KAVEDJIAN', contact: '+598 93 850 204' },
    { id: '154', name: 'Prodhin', technicalDetail: 'palvarez@prodhin.com.uy', contact: '2203 6184' },
    { id: '155', name: 'RTV', technicalDetail: 'BENTANCUR GODOY DIEGO ANDRES', contact: '' },
    { id: '156', name: 'granja del empalme', technicalDetail: '', contact: '' }
];


export const initialActivities: Activity[] = [];
    

    

    