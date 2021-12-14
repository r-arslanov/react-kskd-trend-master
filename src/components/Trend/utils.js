import * as d3 from "d3";
export const locale = d3.timeFormatLocale({
                            "dateTime": "%A, %e %B %Y г. %X",
                            "date": "%d.%m.%Y",
                            "time": "%HH:%MM:%S",
                            "periods": ["AM", "PM"],
                            "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
                            "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
                            "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
                            "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
                        }); 

const formatMillisecond = locale.format(".%L"),
             formatSecond = locale.format(":%S"),
             formatMinute = locale.format("%H:%M"),
             formatHour = locale.format("%H"),
             formatDay = locale.format("%a %d"),
             formatWeek = locale.format("%b %d"),
             formatMonth = locale.format("%B"),
             formatYear = locale.format("%Y");

export function multiFormat(date) {
    return (d3.timeSecond(date) < date ? formatMillisecond
        : d3.timeMinute(date) < date ? formatSecond
        : d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
        : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
        : d3.timeYear(date) < date ? formatMonth
        : formatYear)(date);
}

export const colorPalete = d3.scaleOrdinal().range(['#e41a1c','#377eb8','#1f3999','#72277d','#ff7f00','#ffff33','#8a3f15','#e64c9d','#999999', '#080606']);

export const margin = {top: 10, right: 10, bottom: 0, left: 30};
export const r_margin = {top: 5, bottom: 5, left: 5, right: 5};

export function getWidthElement(svg, i, max_width, current_line){
    var x = 0, y = 0;
    if(i !== 0){
        if((svg.nodes()[0].childNodes[i-1].getBBox().width*2 + svg.nodes()[0].childNodes[i-1].getBBox().x) < max_width){
            x = svg.nodes()[0].childNodes[i-1].getBBox().width + svg.nodes()[0].childNodes[i-1].getBBox().x;
            y = current_line * 20;
        }else{
            current_line++;
            x = 0
            y = current_line * 20;
        }
    }
    return {x, y, current_line};
}

export function genUnId(prefix) {
    return (prefix || '').concat([
        Math.random().toString(16).slice(-4),
        Math.random().toString(16).slice(-4),
        Math.random().toString(16).slice(-4),
        Math.random().toString(16).slice(-4),
        Math.random().toString(16).slice(-4),
        Math.random().toString(16).slice(-4),
        Math.random().toString(16).slice(-4),
        Math.random().toString(16).slice(-4)
    ].join(''))
    }