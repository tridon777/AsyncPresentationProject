const IsNullOrWhiteSpace = value => value === null || value === '' || String(value).trim() === '' || value === undefined || value == 'undefined' || value === 'undefined' ? true : false

const Unique = value => value.filter((element, index, self) => self.indexOf(element) === index)

const fetchPage = async url => {
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html'
        },
        mode: 'no-cors',
        cache: 'default'
    }
    let textToParse = ''
    //catches http status errors thrown
    try {
        textToParse = await fetch(url, config)
            .then(res => res.text())
    } catch (error) {
        console.error(error)
    }

    let page = document.implementation.createHTMLDocument('page')
    const bodyStart = textToParse.indexOf('<body>')
    const bodyEnd = textToParse.indexOf('</body>')

    page.body.insertAdjacentHTML('beforeend', textToParse.substring(bodyStart, bodyEnd))

    return page
}

const links = () => Unique(
    Array.from(document.getElementsByTagName('a'))
        .filter(element =>
            (IsNullOrWhiteSpace(element.href) === false) && (element.href.includes('#') === false && element.href.includes('javascript') === false) && element.nodeName !== 'LINK'
        )
        .filter(element => element.hostname === window.location.hostname)
        .map(element => element.href)
)

function* thisPageEmails(){
    let aTags =  document.querySelectorAll('a').entries()
    for( let a of aTags){
        if (a[1].textContent.includes('@') && a[1].children.length < 1 && (a[1].nodeName !== 'SCRIPT' && a[1].nodeName !== 'STYLE')){
            yield a[1].innerText
        }
    }
    return true
}

const aTag = thisPageEmails()

function* fireLinks(links){
    let allLinks = links.entries()
    for( let link of allLinks){
        yield fetch(link[1])
    }
}

const fire = fireLinks(links())


const emails = email => Unique(
    Array.from(email.all)
        .filter(element => element.textContent.includes('@') && element.children.length < 1 && (element.nodeName !== 'SCRIPT' && element.nodeName !== 'STYLE'))
        .map(element => element.textContent)
)

const example = async () =>{
    let promises = links().map( link => fetchPage(link))
    debugger
    let sync = await Promise.all(promises)
    let result = sync.map(doc => emails(doc))
    console.log(result)
}

example()