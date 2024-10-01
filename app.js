document.addEventListener('DOMContentLoaded', () => {
    const giorniTable = document.getElementById('giorniTable');

    // Crea righe per ciascun giorno del mese
    for (let i = 1; i <= 30; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="checkbox" class="presenza"></td>
            <td><input type="checkbox" class="guida"></td>
            <td>
                <select class="extraMensaFF">
                    <option value="0">Nessuno</option>
                    <option value="extraMensa">Extra Mensa</option>
                    <option value="ff">FF</option>
                </select>
            </td>
            <td>
                <select class="reperibilita">
                    <option value="0">Nessuna</option>
                    <option value="feriale">Feriale</option>
                    <option value="sabato">Sabato</option>
                    <option value="festivo">Festivo</option>
                </select>
            </td>
            <td><input type="checkbox" class="ffCena"></td>
            <td><input type="number" class="straordinarioDiurno" value="0" min="0"></td>
            <td><input type="number" class="straordinarioNotturno" value="0" min="0"></td>
            <td><input type="number" class="straordinarioFestivo" value="0" min="0"></td>
        `;
        giorniTable.appendChild(row);
    }

    // Funzione di calcolo
    window.calcola = function() {
        let totale = 0;
        const stipendioBase = parseFloat(document.getElementById('stipendioBase').value);
        const indennitaGuida = parseFloat(document.getElementById('indennitaGuida').value);
        const extraMensaVal = parseFloat(document.getElementById('extraMensa').value);
        const ffVal = parseFloat(document.getElementById('ff').value);
        const ffCenaVal = parseFloat(document.getElementById('ffCena').value);
        const reperibilitaFerialeVal = parseFloat(document.getElementById('reperibilitaFeriale').value);
        const reperibilitaSabatoVal = parseFloat(document.getElementById('reperibilitaSabato').value);
        const reperibilitaFestivoVal = parseFloat(document.getElementById('reperibilitaFestivo').value);

        document.querySelectorAll('#giorniTable tr').forEach((row, index) => {
            const presenza = row.querySelector('.presenza').checked;
            const guida = row.querySelector('.guida').checked;
            const extraMensaFF = row.querySelector('.extraMensaFF').value;
            const reperibilita = row.querySelector('.reperibilita').value;
            const ffCena = row.querySelector('.ffCena').checked;
            const straordinarioDiurno = parseFloat(row.querySelector('.straordinarioDiurno').value);
            const straordinarioNotturno = parseFloat(row.querySelector('.straordinarioNotturno').value);
            const straordinarioFestivo = parseFloat(row.querySelector('.straordinarioFestivo').value);

            if (presenza) totale += stipendioBase * 8; // Calcolo base per 8 ore di lavoro
            if (guida) totale += indennitaGuida;
            if (extraMensaFF === 'extraMensa') totale += extraMensaVal;
            if (extraMensaFF === 'ff') totale += ffVal;
            if (ffCena) totale += ffCenaVal;

            // Calcola reperibilità
            if (reperibilita === 'feriale') totale += reperibilitaFerialeVal;
            else if (reperibilita === 'sabato') totale += reperibilitaSabatoVal;
            else if (reperibilita === 'festivo') totale += reperibilitaFestivoVal;

            // Calcola straordinari
            totale += straordinarioDiurno * stipendioBase * 1.22;
            totale += straordinarioNotturno * stipendioBase * 1.5;
            totale += straordinarioFestivo * stipendioBase * 1.4;
        });

        document.getElementById('risultato').innerText = `Totale Stipendio: €${totale.toFixed(2)}`;
        salvaDati(); // Salva i dati ogni volta che si calcola
    };

    // Funzione per salvare i dati nel localStorage
    function salvaDati() {
        const parametri = {
            stipendioBase: document.getElementById('stipendioBase').value,
            indennitaGuida: document.getElementById('indennitaGuida').value,
            extraMensa: document.getElementById('extraMensa').value,
            ff: document.getElementById('ff').value,
            ffCena: document.getElementById('ffCena').value,
            reperibilitaFeriale: document.getElementById('reperibilitaFeriale').value,
            reperibilitaSabato: document.getElementById('reperibilitaSabato').value,
            reperibilitaFestivo: document.getElementById('reperibilitaFestivo').value,
            giorni: []
        };

        // Salva i dati giornalieri
        document.querySelectorAll('#giorniTable tr').forEach((row, index) => {
            const giorno = {
                presenza: row.querySelector('.presenza').checked,
                guida: row.querySelector('.guida').checked,
                extraMensaFF: row.querySelector('.extraMensaFF').value,
                reperibilita: row.querySelector('.reperibilita').value,
                ffCena: row.querySelector('.ffCena').checked,
                straordinarioDiurno: row.querySelector('.straordinarioDiurno').value,
                straordinarioNotturno: row.querySelector('.straordinarioNotturno').value,
                straordinarioFestivo: row.querySelector('.straordinarioFestivo').value
            };
            parametri.giorni.push(giorno);
        });

        localStorage.setItem('parametri', JSON.stringify(parametri));
    }

    // Funzione per caricare i dati salvati dal localStorage
    function caricaDati() {
        const parametri = JSON.parse(localStorage.getItem('parametri'));
        if (parametri) {
            document.getElementById('stipendioBase').value = parametri.stipendioBase;
            document.getElementById('indennitaGuida').value = parametri.indennitaGuida;
            document.getElementById('extraMensa').value = parametri.extraMensa;
            document.getElementById('ff').value = parametri.ff;
            document.getElementById('ffCena').value = parametri.ffCena;
            document.getElementById('reperibilitaFeriale').value = parametri.reperibilitaFeriale;
            document.getElementById('reperibilitaSabato').value = parametri.reperibilitaSabato;
            document.getElementById('reperibilitaFestivo').value = parametri.reperibilitaFestivo;

            // Carica i dati giornalieri
            document.querySelectorAll('#giorniTable tr').forEach((row, index) => {
                if (parametri.giorni[index]) {
                    row.querySelector('.presenza').checked = parametri.giorni[index].presenza;
                    row.querySelector('.guida').checked = parametri.giorni[index].guida;
                    row.querySelector('.extraMensaFF').value = parametri.giorni[index].extraMensaFF;
                    row.querySelector('.reperibilita').value = parametri.giorni[index].reperibilita;
                    row.querySelector('.ffCena').checked = parametri.giorni[index].ffCena;
                    row.querySelector('.straordinarioDiurno').value = parametri.giorni[index].straordinarioDiurno;
                    row.querySelector('.straordinarioNotturno').value = parametri.giorni[index].straordinarioNotturno;
                    row.querySelector('.straordinarioFestivo').value = parametri.giorni[index].straordinarioFestivo;
                }
            });
        }
    }

    caricaDati(); // Carica i dati all'avvio
});
