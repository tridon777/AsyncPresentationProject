const IsNullOrWhiteSpace = (value => value === null || value === '' || String(value).trim() === '' || value === undefined || value == 'undefined' || value === 'undefined' ? true : false);

const Unique = (value => value.filter((element, index, self) => self.indexOf(element) === index));

const emails = () => Unique(
    Array.from(document.getElementsByTagName("*"))
    .filter(element => element.textContent.includes('@') && element.children.length < 1 && (element.nodeName !== 'SCRIPT' && element.nodeName !== 'STYLE'))
    .map(element => element.textContent)
);

const getEmails = (inputDocument) => Unique(
    Array.from(inputDocument.all)
    .filter(element => element.textContent.includes('@') && element.children.length < 1 && (element.nodeName !== 'SCRIPT' && element.nodeName !== 'STYLE'))
    .map(element => element.textContent)
);

const links = () => Unique(
    Array.from(document.getElementsByTagName("*"))
    .filter(element => {
        this.href = String(element.href).trim();
        return (IsNullOrWhiteSpace(this.href) === false) && (this.href.includes('#') === false && this.href.includes('javascript') === false) && element.nodeName !== 'LINK';
    })
    .filter(element => element.hostname === window.location.hostname)
    .map(element => element.href)
);

const getLinks = (inputDocument) => Unique(
    Array.from(inputDocument.all)
    .filter(element => {
        this.href = String(element.href).trim();
        return (IsNullOrWhiteSpace(this.href) === false) && (this.href.includes('#') === false && this.href.includes('javascript') === false) && element.nodeName !== 'LINK';
    })
    .filter(element => element.hostname === window.location.hostname)
    .map(element => element.href)
);

let allEmails = [];
let n = 0;

const seeEmails = () => {
    let spamEmails = Unique(allEmails.join().split(',').filter(element => IsNullOrWhiteSpace(element) === false));
    return spamEmails;
};

const htmlParser = (url) => {
    let docRequest = new XMLHttpRequest();
    docRequest.open("GET", url, true);
    docRequest.responseType = 'document';
    docRequest.overrideMimeType('text/html');
    docRequest.onload = function () {
        if (docRequest.readyState === docRequest.DONE) {
            if (docRequest.status === 200) {
                n--;
                debugger
                console.log(n);
                allEmails.push(getEmails(docRequest.responseXML));
                if (n == 0) {
                    console.log(seeEmails());
                }
            }
        }
    };
    docRequest.send(null);
}

(() => {
    allEmails.push(emails());
    n = links().length;
    links().forEach(element => {
        console.log(element);
        htmlParser(element);
    });
})()