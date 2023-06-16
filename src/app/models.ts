export interface Producto {
    nombredelamascota: string;
    tutor: string;
    fechadenacimiento: string;
    especie: string;
    sexo: string;
    telefonotutor: string;
    foto: string;
    uidtutor: string;
    id: string;
    estado: EstadoMascota;
}
export type  EstadoMascota = 'solicitud' | 'true' | 'false' ;

export interface Usuario {
    uid: string;
    correo: string;
    contrasenia: string;
    celular: string;
    direccion: string;
    nombre: string;
    admin: boolean
}

export interface Desp {
    id_des: string;
    fecha_des: any;
    peso_des: string;
    producto_des: string;
    proxi_des: string;
}


export interface Vacunas {
    id_vac: string;
    fecha_vac: string;
    peso_vac: string;
    vacunas: string;
    proxi_vac: string;
}

export interface Admins {
    idusu: string;
    nombre: string;
}



export interface Citas {
    id_cita: string,
    pesomas:string,
    fecha_cita: string,
    idtutor_cita: string,
    motivo_cita: string,
    estadodelacita:EstadoCita,
    id_mascotacita: string,
    foto_cita:string,
    namepet:string,
    diagnostico:string;
    receta_consul: boolean;
    nombreusu:string;
    correousu: string;
    cirugia_consul: boolean;
    hospi_consul: boolean;
    observacion_cita:string;
}

export interface Hospi {
    id_hospi: string,
    fecha_hospi:string,
    motivo_hospi: string,
    medico_hospi: string,
}

export interface Receta {
    id_receta: string,
    medicamento_receta: string,
    indicaciones_receta: string,
}

export type  EstadoCita = 'agendado' | 'atendido' | 'cancelado' ;


export interface servicios {
    id_servicio:string;
    tipo_servicio:string;
    precio_servicio:string;
    estado_servicio:boolean
}

export interface Comentarios{
    id:string;
    comentario:string;
    estado:EstadoMascota;
    usuario:string;
    uidusu:string;
}
