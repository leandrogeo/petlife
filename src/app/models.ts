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