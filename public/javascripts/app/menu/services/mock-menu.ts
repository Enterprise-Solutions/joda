export var MENU = [
	{
		"id": 1,
		"nombre": "Organizacion",
		"route": "OrgComponent",
		"cus": [
			{
				"id": 1,
				"nombre": "Mantener Personas",
				"route": "PersonasComponent"
			},{
				"id": 2,
				"nombre": "Mantener Organizaciones",
				"route": "OrganizacionesComponent"
			},{
				"id": 3,
				"nombre": "Mantener Tipos de Documento",
				"route": "TiposDocumentoComponent"
			}
		]
	},{
		"id": 2,
		"nombre": "Administracion",
		"route": "AdmComponent",
		"cus": [
			{
				"id": 1,
				"nombre": "Mantener Usuarios",
				"route": "UsuariosComponent"
			}
		]
	}, {
		"id": 3,
		"nombre": "Contabilidad",
		"route": "ContComponent",
		"cus": [
			{
				"id": 1,
				"nombre": "Periodos",
				"route": "PeriodosComponent"
			}
		]
	}, {
		"id": 4,
		"nombre": "Configuracion",
		"route": "ConfComponent",
		"cus": []
	}
];