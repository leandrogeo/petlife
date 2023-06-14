import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistrosComponent } from './registros/registros.component';
import { BuscarComponent } from './buscar/buscar.component';
import { MascotasComponent } from './mascotas/mascotas.component';
import { PerfilesmascotasComponent } from './perfilesmascotas/perfilesmascotas.component';
import { CitasComponent } from './citas/citas.component';
import { CarnetComponent } from './carnet/carnet.component';
import { VisualizarcarnetComponent } from './visualizarcarnet/visualizarcarnet.component';
import { ComponentesModule } from "../componentes/componentes.module";
import { CitasgeneralesComponent } from './citasgenerales/citasgenerales.component';
import { ModificarcitaComponent } from './modificarcita/modificarcita.component';
import { ReportecitasgeneralComponent } from './reportecitasgeneral/reportecitasgeneral.component';
import { VistadesparacitacionComponent } from './vistavacunas/vistadesparacitacion.component';
import { VistadesComponent } from './vistades/vistades.component';
import { EditarusuComponent } from './editarusu/editarusu.component';
import { EdicionComponent } from './edicion/edicion.component';
import { ModificardesComponent } from './modificardes/modificardes.component';
import { ModificarvacunaComponent } from './modificarvacuna/modificarvacuna.component';



@NgModule({
    declarations: [
        HomeComponent,
        PerfilComponent,
        RegistrosComponent,
        BuscarComponent,
        MascotasComponent,
        CarnetComponent,
        CitasComponent,
        VisualizarcarnetComponent,
        PerfilesmascotasComponent,
        CitasgeneralesComponent,
        ModificarcitaComponent,
        ReportecitasgeneralComponent,
        VistadesparacitacionComponent,
        VistadesComponent,
        EditarusuComponent,
        ModificarvacunaComponent,
        EdicionComponent, 
        ModificardesComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        RouterModule,
        ComponentesModule,
    ]
})
export class PagesModule { }
