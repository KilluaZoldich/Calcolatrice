document.addEventListener('DOMContentLoaded', () => {
    const settimana1 = document.getElementById('giorniTableSettimana1');
    const settimana2 = document.getElementById('giorniTableSettimana2');
    const settimana3 = document.getElementById('giorniTableSettimana3');
    const settimana4 = document.getElementById('giorniTableSettimana4');

    for (let i = 1; i <= 30; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="checkbox" class="presenza" data-giorno="${i}"></td>
            <td><input type="checkbox" class="guida" data-giorno="${i}"></td>
            <td>
                <select class="extraMensaFF" data-giorno="${i}">
                    <option value="0">Nessuno</option>
                    <option value="extraMensa">Extra Mensa</option>
                    <option value="ff">FF</option>
                </select>
            </td>
            <td>
                <select class="reperibilita" data-giorno="${i}">
                    <option value="0">Nessuna</option>
                    <option value="feriale">Feriale</option>
                    <option value="sabato">Sabato</option>
                    <option value="festivo">Festivo</option>
                </select>
            </td>
            <td><input type="checkbox" class="ffCena" data-giorno="${i}"></td>
            <td><input type="number" class="straordinarioDiurno" value="0" min="0" data-giorno="${i}"></td>
            <td><input type="number" class="straordinarioNotturno" value="0" min="0" data-giorno="${i}"></td>
            <td><input type="number" class="straordinarioFestivo" value="0" min="0" data-giorno="${i}"></td>
        `;

        if (i <= 7) settimana1.appendChild(row);
        else if (i <= 14) settimana2.appendChild(row);
        else if (i <= 21) settimana3.appendChild(row);
        else settimana4.appendChild(row);
    }

    // Funzione per salvare i dati nel localStorage
    function salvaDati() {
        const dati = [];
        document.querySelectorAll('tbody tr').forEach((row) => {
            const giorno = {};
            giorno.presenza = row.querySelector('.presenza').checked;
            giorno.guida = row.querySelector('.guida').checked;
            giorno.extraMensaFF = row.querySelector('.extraMensaFF').value;
            giorno.reperibilita = row.querySelector('.reperibilita').value;
            giorno.ffCena = row.querySelector('.ffCena').checked;
            giorno.straordinarioDiurno = row.querySelector('.straordinarioDiurno').value;
            giorno.straordinarioNotturno = row.querySelector('.straordinarioNotturno').value;
            giorno.straordinarioFestivo = row.querySelector('.straordinarioFestivo').value;

            dati.push(giorno);
        });
        localStorage.setItem('datiGiorni', JSON.stringify(dati));
    }

    // Carica i dati dal localStorage
    function caricaDati() {
        const datiSalvati = JSON.parse(localStorage.getItem('datiGiorni'));
        if (datiSalvati) {
            document.querySelectorAll('tbody tr').forEach((row, index) => {
                if (datiSalvati[index]) {
                    row.querySelector('.presenza').checked = datiSalvati[index].presenza;
                    row.querySelector('.guida').checked = datiSalvati[index].guida;
                    row.querySelector('.extraMensaFF').value = datiSalvati[index].extraMensaFF;
                    row.querySelector('.reperibilita').value = datiSalvati[index].reperibilita;
                    row.querySelector('.ffCena').checked = datiSalvati[index].ffCena;
                    row.querySelector('.straordinarioDiurno').value = datiSalvati[index].straordinarioDiurno;
                    row.querySelector('.straordinarioNotturno').value = datiSalvati[index].straordinarioNotturno;
                    row.querySelector('.straordinarioFestivo').value = datiSalvati[index].straordinarioFestivo;
                }
            });
        }
    }

    // Funzione di calcolo del totale
    window.calcola = function() {
        let totale = 0;
        const stipendioBase = parseFloat(document.getElementById('stipendioBase').value) || 0;
        const indennitaGuida = parseFloat(document.getElementById('indennitaGuida').value) || 0;
        const extraMensaVal = parseFloat(document.getElementById('extraMensa').value) || 0;
        const ffVal = parseFloat(document.getElementById('ff').value) || 0;
        const ffCenaVal = parseFloat(document.getElementById('ffCena').value) || 0;
        const reperibilitaFerialeVal = parseFloat(document.getElementById('reperibilitaFeriale').value) || 0;
        const reperibilitaSabatoVal = parseFloat(document.getElementById('reperibilitaSabato').value) || 0;
        const reperibilitaFestivoVal = parseFloat(document.getElementById('reperibilitaFestivo').value) || 0;

        document.querySelectorAll('tbody tr').forEach((row) => {
            const presenza = row.querySelector('.presenza').checked;
            const guida = row.querySelector('.guida').checked;
            const extraMensaFF = row.querySelector('.extraMensaFF').value;
            const reperibilita = row.querySelector('.reperibilita').value;
            const ffCena = row.querySelector('.ffCena').checked;
            const straordinarioDiurno = parseFloat(row.querySelector('.straordinarioDiurno').value) || 0;
            const straordinarioNotturno = parseFloat(row.querySelector('.straordinarioNotturno').value) || 0;
            const straordinarioFestivo = parseFloat(row.querySelector('.straordinarioFestivo').value) || 0;

            // Esegui i calcoli solo se la presenza è flaggata
            if (presenza) totale += stipendioBase * 8;
            if (guida) totale += indennitaGuida;
            if (extraMensaFF === 'extraMensa') totale += extraMensaVal;
            if (extraMensaFF === 'ff') totale += ffVal;
            if (ffCena) totale += ffCenaVal;

            // Calcola la reperibilità
            if (reperibilita === 'feriale') totale += reperibilitaFerialeVal;
            else if (reperibilita === 'sabato') totale += reperibilitaSabatoVal;
            else if (reperibilita === 'festivo') totale += reperibilitaFestivoVal;

            // Calcola straordinari
            totale += straordinarioDiurno * stipendioBase * 1.22;
            totale += straordinarioNotturno * stipendioBase * 1.5;
            totale += straordinarioFestivo * stipendioBase * 1.4;
        });

        // Mostra il risultato
        document.getElementById('risultato').innerText = `Totale Stipendio: €${totale.toFixed(2)}`;
    };

    // Salva i dati ogni volta che c'è un cambiamento
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('change', salvaDati);
    });

    caricaDati(); // Carica i dati salvati all'avvio
});
