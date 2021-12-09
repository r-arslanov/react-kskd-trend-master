const root_ip = "https://192.168.30.103";
class Rest{
    
    //Забираем с сервера список кустов    
    getKusts(cbTypes){
        let url = root_ip + "/getKusts";
            fetch(url,{
                method: "GET"
            }).then(raw =>{
                return raw.json();
            }).then(response=>{
                cbTypes(response);
            }).catch((e) => {console.log('getKusts Error: ' + e.message); return alert("Невозможно считать список кустов!")});
    };

    //Забираем с сервера типы объектов (СУЭЦН, ГЗУ, АИ и т.д.)
    getTypes(cbTypes){
        let url = root_ip + "/getTypes";
        //192.168.30.103
            fetch(url,{
                method: "GET"
            }).then(raw =>{
                return raw.json();
            }).then(response=>{
                cbTypes(response);
            }).catch((e) => {console.log('Error: ' + e.message); return alert("Невозможно считать типы объектов!")});
    };

    //Забираем с сервера список объектов типа объекта (см getTypes)
    getObjects(kust, type, cbTypes){
        let url = root_ip + "/getObjects?";
        url += "kust=" + encodeURI(kust);
        url += "&type=" + encodeURI(type);
        fetch(url,{
            method: "GET"
        }).then(raw =>{
            return raw.json();
        }).then(response=>{
            cbTypes(response);
        }).catch((e) => console.log('Error: ' + e.message));
        };

    getHistory(kust, dateStart, dateEnd, dps, cbTypes){
            let url = root_ip + "/getHistory?";
            url += "sys=" + encodeURI(kust + ":");
            url += "&start=" + encodeURI(parseInt(dateStart.getTime()/1000));
            url += "&end=" + encodeURI(parseInt(dateEnd.getTime()/1000));
            dps.forEach((dp, index) => {
                url += "&dp" + index + "=" + encodeURIComponent(dp)
            });
            console.log("URL", url);
            fetch(url,{
                method: "GET"
            }).then(raw =>{
                return raw.json();
            }).then(response=>{
                cbTypes(response);
                console.log("DATA FROM KASKAD", response);
            }).catch((e) => {
                console.log('Error: ' + e.message);
            });
    };
}

const _Rest = new Rest();
export { _Rest as Rest };