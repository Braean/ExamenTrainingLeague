
const Excel = require('Excel4node');

//---------------------------------------- INICIALIZACION DEL JUEGO -------------------------------------------------

console.log("\n\n***CHALLENGE CAR***\n\n");
console.log("Configuración del Juego\n\n");

const distancia = 15;  //

console.log(`La distancia máxima de las pistas es ${distancia} km\n\n`);

class Juego{
    
    constructor(id){
        this.id = id;
    }

    configurarJuego(jugadores,conductores,carros,carriles){
        for(let i=0; i<jugadores.length;i++){
            conductores.push(new Conductor(jugadores[i], new Podio()));
            carros.push(new Carro(conductores[i]));
            carriles.push(new Carril(carros[i]));
        }
        return;
    }

    iniciarJuego(jugadores,conductores,carros,carriles,distancia){
        console.log(`**Inicia el juego ${this.id}**\n`);
        let contadorPodio = 0;
        while(contadorPodio !== jugadores.length){
            for(let i=0;i<jugadores.length;i++){
                if(conductores[i].podio>0){
                    continue;
                }else{
                    this.turnoJugador(carriles[i], jugadores[i]);
                    contadorPodio = this.validarAvance(jugadores[i],carriles[i], conductores[i] ,distancia, contadorPodio); 
                }
            }
        }
        this.persistirResultados(jugadores,conductores);
        return;        
    }

    turnoJugador(carril, jugador){
        let resultado;
        console.log(`Turno del jugador ${jugador}\n`);
        resultado = this.dado();
        console.log(`El jugador ${jugador} sacó el ${resultado}\n`);
        carril.avanceCarro = carril.avanceCarro + (resultado*100);
        console.log(`El jugador ${jugador} ha avanzdo ${carril.avanceCarro} m\n`);
        return;
    }

    validarAvance(jugador,carril,conductor,distancia, contadorPodio){
        if(carril.avanceCarro >= (distancia*1000)){
            contadorPodio++;
            conductor.podio = contadorPodio;
            console.log(`El jugador ${jugador} quedó en el puesto ${conductor.podio}\n`);
        }
        return contadorPodio;
    }

    persistirResultados(jugadores, conductores){
        let workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Podios');
        worksheet.cell(1,1).string('Jugadores');
        worksheet.cell(1,2).string('Podio');
        for(let i=0;i<jugadores.length;i++){
            worksheet.cell(i+2,1).string(jugadores[i]);
            worksheet.cell(i+2,2).string(conductores[i].podio.toString());
        }    
        workbook.write('Resultados.xlsx');
        return;
    }

    dado() {
        return Math.floor(Math.random() * (6 - 1) + 1);
    }
}

class Conductor{
  constructor(nombre, podio){
    this.nombre = nombre;
    this.podio = podio;
  }
}

class Carro{
    constructor(conductor){
        this.conductor = conductor;
    }
}

class Carril{
    constructor(carro){
        this.carro = carro;
        this.avanceCarro = 0;
    }
}

class Pista{
    constructor(carril, distancia){
        this.carril = carril;
        this.distancia = distancia;
    }
}

class Podio{
    constructor(){
        this.puesto = 0;
    }
}

let jugadores = ['Diego', 'Juan', 'Jhon', 'Sara'];
let conductores = [];
let carros = [];
let carriles = [];

let juego1 = new Juego(1);
juego1.configurarJuego(jugadores,conductores,carros,carriles);
juego1.iniciarJuego(jugadores,conductores,carros,carriles,distancia);



