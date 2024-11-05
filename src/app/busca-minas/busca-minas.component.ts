import { Component, OnInit } from '@angular/core';
import { Celda } from '../interfaz/celda';

@Component({
  selector: 'app-busca-minas',
  templateUrl: './busca-minas.component.html',
  styleUrls: ['./busca-minas.component.css']
})
export class BuscaMinasComponent implements OnInit {
  filas: number = 0;
  columnas: number = 0;
  minas: number = 0;
  tablero: Celda[][] = [];
  juegoTerminado: boolean = false;
  mensaje: string = '';

  ngOnInit() {}

  iniciarJuego() {
    const cantidadMinas = this.minas;

    if (cantidadMinas < 1) {
      this.mensaje = 'La cantidad de minas debe ser al menos 1.';
      return;
    }

    
    this.filas = cantidadMinas; 
    this.columnas = cantidadMinas; 

    const totalCeldas = this.filas * this.columnas;

    if (cantidadMinas >= totalCeldas) {
      this.mensaje = 'La cantidad de minas debe ser menor que el número total de celdas.';
      return;
    }

    this.juegoTerminado = false;
    this.mensaje = '';
    this.tablero = Array.from({ length: this.filas }, () =>
      Array.from({ length: this.columnas }, () => ({
        mina: false,
        descubierta: false,
        numero: 0
      })) as Celda[]
    );

    this.plantarMinas();
    this.calcularNumeros();
  }

  plantarMinas() {
    let minasPlantadas = 0;
    while (minasPlantadas < this.minas) {
      const fila = Math.floor(Math.random() * this.filas);
      const columna = Math.floor(Math.random() * this.columnas);
      if (!this.tablero[fila][columna].mina) {
        this.tablero[fila][columna].mina = true;
        minasPlantadas++;
      }
    }
  }

  calcularNumeros() {
    for (let i = 0; i < this.filas; i++) {
      for (let j = 0; j < this.columnas; j++) {
        if (!this.tablero[i][j].mina) {
          this.tablero[i][j].numero = this.contarMinasAlrededor(i, j);
        }
      }
    }
  }

  contarMinasAlrededor(fila: number, columna: number): number {
    const posiciones = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    let conteo = 0;
    for (const [dx, dy] of posiciones) {
      const nuevaFila = fila + dx;
      const nuevaColumna = columna + dy;
      if (nuevaFila >= 0 && nuevaFila < this.filas && nuevaColumna >= 0 && nuevaColumna < this.columnas) {
        if (this.tablero[nuevaFila][nuevaColumna].mina) {
          conteo++;
        }
      }
    }
    return conteo;
  }

  descubrirCelda(fila: number, columna: number) {
    if (this.juegoTerminado || this.tablero[fila][columna].descubierta) return;

    this.tablero[fila][columna].descubierta = true;

    if (this.tablero[fila][columna].mina) {
      this.mensaje = '¡Perdiste! Has descubierto una mina.';
      this.juegoTerminado = true;
    } else if (this.tablero[fila][columna].numero === 0) {
      this.descubrirEspacios(fila, columna);
    }

    if (this.verificarVictoria()) {
      this.mensaje = '¡Felicidades! Has ganado.';
      this.juegoTerminado = true;
    }
  }

  descubrirEspacios(fila: number, columna: number) {
    const posiciones = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of posiciones) {
      const nuevaFila = fila + dx;
      const nuevaColumna = columna + dy;
      if (
        nuevaFila >= 0 && nuevaFila < this.filas &&
        nuevaColumna >= 0 && nuevaColumna < this.columnas &&
        !this.tablero[nuevaFila][nuevaColumna].mina &&
        !this.tablero[nuevaFila][nuevaColumna].descubierta
      ) {
        this.tablero[nuevaFila][nuevaColumna].descubierta = true;
        if (this.tablero[nuevaFila][nuevaColumna].numero === 0) {
          this.descubrirEspacios(nuevaFila, nuevaColumna);
        }
      }
    }
  }

  verificarVictoria(): boolean {
    for (let i = 0; i < this.filas; i++) {
      for (let j = 0; j < this.columnas; j++) {
        if (!this.tablero[i][j].mina && !this.tablero[i][j].descubierta) {
          return false;
        }
      }
    }
    return true;
  }
}
