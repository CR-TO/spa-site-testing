

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href)
    handleSwitch();
}

const routes = {
    404: './pages/404.html',
    '/': './index.html',
    '/home': './pages/home.html',
    '/test': './pages/test.html',
    '/page': './pages/page.html'
}


export const getPage = async (id) => {
    const app = document.getElementById("root");

    let raw = await fetch(id);
    let data = await raw.text();
    
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, 'text/html');

    let template;
    if (doc.getElementsByTagName('template').length !== 0) {
        template = doc.getElementsByTagName('template').item(0).innerHTML;
    } else {
        console.log(`${id} has no template`);
    }

    if (template) {
        app.innerHTML = template;
    }

    let script = doc.getElementsByTagName('script').item(0);

    if (script !== null) {
        let scritpDom = document.createElement('script');
        scritpDom.type = 'module'
        scritpDom.innerHTML = script.innerHTML;
        app.appendChild(scritpDom)
    }
}


export const handleSwitch = async () => {
    const path = window.location.pathname;
    if (path !== '/'){
    const route = routes[path] || routes[404];
    console.log(route);

    await getPage(route)
}
}

window.route = route;
window.onpopstate = handleSwitch;

handleSwitch();
