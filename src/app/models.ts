export interface Producto {
    nombredelamascota: string;
    tutor: string;
    fechadenacimiento: Date;
    especie: string;
    sexo:string;
    telefonotutor:string;
    foto: string;
    id: string;
    
}

export interface Usuario {
    uid:string;
    correo:string;
    contrasenia:string;
    celular:string;
    direccion:string;
    nombre:string;
}

export interface Desp {
    id_des:string;
    fecha_des:string;
    peso_des:string;
    producto_des:string;
    proxi_des:string;
}


export interface Vacunas {
    id_vac:string;
    fecha_vac:string;
    peso_vac:string;
    vacunas:string;
    proxi_vac:string;
}