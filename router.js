

export const router = {
    setLocation: (location) => {
        window.location = location;
    }
}

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href)
    handleSwitch();
}

export let routes = {
    404: './pages/404.html',
    '/': './index.html',
    '/home': './pages/home.html',
    '/test': './pages/page.html',
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

    let scripts = doc.getElementsByTagName('script');


    for(const script of scripts)
    {
        let scritpDom = document.createElement('script');
        if (script.textContent == ''){
            let d = await fetch(script.src);
            let j = await d.text();
            scritpDom.innerHTML = j;
        } else {
            scritpDom.type = 'module'
            scritpDom.innerHTML = script.innerHTML;
        }
        app.appendChild(scritpDom)
    }
}


export const handleSwitch = async () => {
    const path = window.location.pathname;
    if (path !== '/'){
    const route = routes[path] || routes[404];
    await getPage(route)
    }
}

window.route = route;
window.onpopstate = handleSwitch;

handleSwitch();
