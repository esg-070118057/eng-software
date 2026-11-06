let cachePrev;
let elemPrevisoes = document.getElementById('previsoes');
function constroiPrev( entrada )
{
    cachePrev = entrada;
    for (let i=0; i<5; i++) {
        let novoDiv = document.createElement('div');
        let diaSemana = new Date(entrada.data[i].forecastDate);

        let urlImg = "https://www.ipma.pt/opencms/bin/icons/svg/weather/w_ic_d_"
        let id = entrada.data[i].idWeatherType;
        if (id < 10)
            id = "0" + id;
        urlImg += id;
        urlImg += "anim.svg"

        novoDiv.innerHTML = `
            <h3 class="diaSemana">${diaSemana.toLocaleDateString('pt-PT', {weekday: 'long'})}</h3>
            <p class="max">${entrada.data[i].tMax}</p>
            <p class="min">${entrada.data[i].tMin}</p>
            <img src="${urlImg}" width="50">
            `;

        elemPrevisoes.append(novoDiv);
    }
}

// Construimos as previsoes meteorologicas iniciais na pagina
let urlIpma = 'https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1141600.json';
fetch(urlIpma)
    .then( function( resposta ) {
        return resposta.json();
    })
        .then( function( retorno ) {
            constroiPrev( retorno );
        })
console.log('cachePrev:', cachePrev);



let elemFormD = document.getElementById('fo_dist');
let elemInputD = document.getElementById('in_dist');
let elemDistrito = document.getElementById('distrito');
let elemDistritoId = document.getElementById('distritoId');

const urlDist = 'https://api.ipma.pt/open-data/distrits-islands.json';
let cacheDist;
fetch(urlDist)
    .then( function( respostaDist ) {
        return respostaDist.json();  // Encaminhamos o .json com o array de distritos...
    })
        .then( function( retornoDist ) {
            cacheDist = retornoDist;  // ...e guardamos em cacheDist para usarmos mais tarde
        })
console.log('cacheDist:', cacheDist);

function pesqDistrito( e ) {
    e.preventDefault();  // Evitar o reload da pagina ao pesquisar distrito (submit da form)
    // Removemos os acentos e outros caracteres esquisitos e guardamos em inputNorm
    inputNorm = elemInputD.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    elemFormD.reset();

    elemDistrito.textContent = "Distrito";
    elemDistritoId.textContent = "Id";
    for (let i=0; i<cacheDist.data.length; i++) {
        // Removemos os acentos e outros caracteres esquisitos e guardamos em localNorm
        let localNorm = cacheDist.data[i].local.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        // Ignoramos maiusculas minusculas
        if (localNorm.toLowerCase() == inputNorm.toLowerCase()) {
            elemDistrito.textContent = localNorm;
            elemDistritoId.textContent = cacheDist.data[i].globalIdLocal;
            urlIpma = 'https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/'
            urlIpma += elemDistritoId.textContent;
            urlIpma += '.json';
            elemPrevisoes.innerHTML = "";
            fetch(urlIpma)
                .then( function( resposta ) {
                    return resposta.json();
                })
                    .then( function( retorno ) {
                        constroiPrev( retorno );
                    })
            break;
        }
    }
}
elemFormD.addEventListener('submit', pesqDistrito )



let cacheNoti;
let elemNoticias = document.getElementById('noticias');
function constroiNoti( entrada )
{
    cacheNoti = entrada;
    for (let i=0; i<entrada.news.length; i=i+2) {
        let novoArt = document.createElement('article');

        if (entrada.news[i].image == 'None')
            entrada.news[i].image = 'https://currentsapi.services/en/img/logo-banner.svg'
        if (entrada.news[i+1].image == 'None')
            entrada.news[i+1].image = 'https://currentsapi.services/en/img/logo-banner.svg'
        novoArt.innerHTML = `
            <div class="contentor">
                <div class="esquerda">
                    <h2>${entrada.news[i].title}</h2>
                    <a href='${entrada.news[i].url}'> 
                        <img src='${entrada.news[i].image}' width='80%'>
                    </a>
                    <p>${entrada.news[i].description}</p>
                </div>
                <div class="direita">
                    <h2>${entrada.news[i+1].title}</h2>
                    <a href='${entrada.news[i+1].url}'> 
                        <img src='${entrada.news[i+1].image}' width='80%'>
                    </a>
                    <p>${entrada.news[i+1].description}</p>
                </div>
            </div>
            `;

        elemNoticias.append(novoArt);
    }
}

const chaveCurrents  = 'PENehORsJc2vmnzrl-lreFmtLRR4vFhdQJyw71kEzNoiABEQ';
const chaveCurrents2 = 'PENehORsJc2vmnzrl-lreFmtLRR4vFhdQJyw71kEzNoiABEQ';

// Construimos as noticias iniciais na pagina
let urlCurrents;
let storedCapiCat = localStorage.getItem('capiCat');
if (storedCapiCat == null) {
    urlCurrents = 'https://api.currentsapi.services/v1/latest-news?language=pt&apiKey=';
    urlCurrents += chaveCurrents;
} else {
    urlCurrents = "https://api.currentsapi.services/v2/search?category=";
    urlCurrents += storedCapiCat;
    urlCurrents += "&language=pt&apiKey=";
    urlCurrents += chaveCurrents;
}
fetch(urlCurrents)
    .then(resposta => resposta.json())
    .then(retorno => constroiNoti(retorno));
console.log('cacheNoti:', cacheNoti);
console.log('storedCapiCat:', storedCapiCat);



let elemFormT = document.getElementById('fo_tema');
let elemInputT = document.getElementById('in_tema');
let elemTema = document.getElementById('tema');

function pesqTema( e ) {
    e.preventDefault();  // Evitar o reload da pagina ao pesquisar tema (submit da form)
    // Removemos os acentos e outros caracteres esquisitos e guardamos em inputNorm
    inputNorm = elemInputT.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    elemFormT.reset();

    elemTema.textContent = "Últimas notícias";
    // Ignoramos maiusculas minusculas
    temaNorm = inputNorm.toLowerCase().replace(/ /g, '%20');
    elemTema.textContent = temaNorm;

    elemNoticias.innerHTML = ``;

    let urlTema = 'https://api.currentsapi.services/v1/search?keywords=';
    urlTema += temaNorm;
    urlTema += '&language=pt&apiKey=';
    urlTema += chaveCurrents2;
    fetch(urlTema).then(resposta => resposta.json()).then(retorno => constroiNoti(retorno));
}
elemFormT.addEventListener('submit', pesqTema )



let elemFormC = document.getElementById('fo_categoria');
let elemSelectC = document.getElementById('se_categoria');
elemSelectC.innerHTML = `<option value="Nenhuma">Nenhuma</option>`;

const urlCat = 'https://api.currentsapi.services/v2/available/categories';
let cacheCat;
fetch(urlCat)
    .then( function( respostaCat ) {
        return respostaCat.json();  // Encaminhamos o .json com o array de categorias...
    })
        .then( function( retornoCat ) {
            cacheCat = retornoCat;  // ...e guardamos em cacheCat para usarmos mais tarde
            for (let i=0; i<cacheCat.categories.length; i++) {
                elemSelectC.innerHTML += `
                    <option value="${cacheCat.categories[i]}">${cacheCat.categories[i]}</option>
                    `;
            }
            if (storedCapiCat == null)
                elemSelectC.value = "Nenhuma";
            else
                elemSelectC.value = storedCapiCat;
        })
console.log('cacheCat:', cacheCat);

function pesqCat( e ) {
    elemTema.textContent = "Últimas notícias";

    elemNoticias.innerHTML = "";
    if (elemSelectC.value == "Nenhuma") {
        fetch(urlCurrents)
            .then(resposta => resposta.json())
            .then(retorno => constroiNoti(retorno));
    } else {
        let urlSelecao = "https://api.currentsapi.services/v2/search?category=";
        urlSelecao += elemSelectC.value;
        urlSelecao += "&language=pt&apiKey=";
        urlSelecao += chaveCurrents2;
        fetch(urlSelecao)
            .then(resposta => resposta.json())
            .then(retorno => constroiNoti(retorno));
        console.log('value:', elemSelectC.value);
        localStorage.setItem('capiCat', elemSelectC.value)
    }
}
elemSelectC.addEventListener('change', pesqCat )

function limpCat( e ) {
    localStorage.clear();
}
elemFormC.addEventListener('submit', limpCat )
