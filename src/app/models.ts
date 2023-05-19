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
}

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
    examenen_consul: boolean;
    imagen_consul: boolean;
    cirugia_consul: boolean;
    hospi_consul: boolean;
}

export type  EstadoCita = 'agendado' | 'atendido' | 'cancelado' ;
