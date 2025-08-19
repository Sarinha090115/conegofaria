// Substitua dentro do loop, logo após let dt = new Date(year, month, date);
const diaClicado = date; // capture o valor do dia atual
cell.onclick = function() {
    let desc = '';
    const dataStr = `Dia ${diaClicado.toString().padStart(2, '0')}/${(month+1).toString().padStart(2, '0')}/${year}`;
    let feriadoStr = isFeriado(dt) ? 'Feriado Nacional' : 'Não é feriado';
    if (isFeriado(dt)) {
        desc = `${dataStr}: Feriado Nacional.`;
    } else if (isLetivo(dt)) {
        desc = `${dataStr}: Dia letivo (aula). ${feriadoStr}.`;
    } else if (dt.getDay() === 0) {
        desc = `${dataStr}: Domingo (final de semana). ${feriadoStr}.`;
    } else if (dt.getDay() === 6) {
        desc = `${dataStr}: Sábado (final de semana). ${feriadoStr}.`;
    } else {
        desc = `${dataStr}. ${feriadoStr}.`;
    }
    document.getElementById('descricao-dia').textContent = desc;
};
const feriados = [
    "2025-01-01", "2025-03-03", "2025-03-04", "2025-04-18", "2025-04-21",
    "2025-05-01", "2025-06-19", "2025-09-07", "2025-10-12", "2025-11-02",
    "2025-11-15", "2025-12-25"
];

function isFeriado(date) {
    return feriados.includes(date.toISOString().slice(0,10));
}

function isLetivo(date) {
    const day = date.getDay();
    // Segunda (1) a sexta (5)
    return day >= 1 && day <= 5 && !isFeriado(date);
}

function getLetivasAno(ano) {
    let letivas = [];
    for (let m = 0; m < 12; m++) {
        let days = new Date(ano, m+1, 0).getDate();
        for (let d = 1; d <= days; d++) {
            let dt = new Date(ano, m, d);
            if (isLetivo(dt)) {
                letivas.push(dt);
            }
        }
    }
    return letivas;
}

let currentMonth = 0; // Janeiro
let currentYear = 2025;
const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function renderCalendar(month, year) {
    const tbody = document.getElementById('calendarBody');
    tbody.innerHTML = '';
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                cell.innerHTML = '';
            } else if (date > daysInMonth) {
                cell.innerHTML = '';
            } else {
                let dt = new Date(year, month, date);
                cell.innerHTML = date;
                if (isFeriado(dt)) {
                    cell.classList.add('feriado');
                    cell.title = 'Feriado';
                } else if (isLetivo(dt)) {
                    cell.classList.add('letivo');
                    cell.title = 'Dia letivo';
                } else if (dt.getDay() === 0 || dt.getDay() === 6) {
                    cell.classList.add('nao-letivo');
                }
                // Destaca o dia de hoje se for 2025
                const hoje = new Date();
                if (dt.getFullYear() === hoje.getFullYear() && dt.getMonth() === hoje.getMonth() && dt.getDate() === hoje.getDate()) {
                    cell.classList.add('hoje');
                }
                // Adiciona evento de clique para mostrar descrição
                cell.style.cursor = 'pointer';
                cell.onclick = function() {
                    let desc = '';
                    const dataStr = `Dia ${date.toString().padStart(2, '0')}/${(month+1).toString().padStart(2, '0')}/${year}`;
                    let feriadoStr = isFeriado(dt) ? 'Feriado Nacional' : 'Não é feriado';
                    if (isFeriado(dt)) {
                        desc = `${dataStr}: Feriado Nacional.`;
                    } else if (isLetivo(dt)) {
                        desc = `${dataStr}: Dia letivo (aula). ${feriadoStr}.`;
                    } else if (dt.getDay() === 0) {
                        desc = `${dataStr}: Domingo (final de semana). ${feriadoStr}.`;
                    } else if (dt.getDay() === 6) {
                        desc = `${dataStr}: Sábado (final de semana). ${feriadoStr}.`;
                    } else {
                        desc = `${dataStr}. ${feriadoStr}.`;
                    }
                    document.getElementById('descricao-dia').textContent = desc;
                };
                date++;
            }
            row.appendChild(cell);
        }
        tbody.appendChild(row);
        if (date > daysInMonth) break;
    }
    document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;
}

// Efeito de transição suave ao trocar de mês
function fadeOutInCalendar(callback) {
    const tbody = document.getElementById('calendarBody');
    tbody.style.transition = 'opacity 0.3s';
    tbody.style.opacity = 0;
    setTimeout(() => {
        callback();
        tbody.style.opacity = 1;
    }, 300);
}

// Limpa a descrição ao trocar de mês
function clearDescricaoDia() {
    document.getElementById('descricao-dia').textContent = '';
}

// Substitua os eventos dos botões:
document.getElementById('prevMonth').onclick = () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    fadeOutInCalendar(() => { renderCalendar(currentMonth, currentYear); clearDescricaoDia(); });
};
document.getElementById('nextMonth').onclick = () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    fadeOutInCalendar(() => { renderCalendar(currentMonth, currentYear); clearDescricaoDia(); });
};

// Inicialização
renderCalendar(currentMonth, currentYear);