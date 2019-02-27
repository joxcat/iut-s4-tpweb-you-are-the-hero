document.addEventListener('DOMContentLoaded', () => {
  // Page d'accueil
  document.querySelector('span[data-target="#1"]').addEventListener('click', onLink);
  actualise();
});

// Réecrire le pull-to-reload pour recommencer l'aventure
let _startY;
document.body.addEventListener('touchstart', e => {
  _startY = e.touches[0].pageY;
}, {passive: true});
document.body.addEventListener('touchmove', e => {
  const y = e.touches[0].pageY;
  if (document.scrollingElement.scrollTop === 0 && y > _startY) {
    document.location.href = "/";
  }
}, {passive: true});
document.onkeyup = (e: KeyboardEvent) => {
  // f5, backspace, escape
  if ([116, 8, 27].indexOf(e.keyCode) !== -1) {
    e.preventDefault();
    document.location.href = "/";
  }
}

// Contenu de la page
function actualise(precise?: number) {
  let hash = precise || window.location.hash.split('#')[1] || -1;
  let maintext: Element = document.querySelector('.maintext');
  let choices: Element = document.querySelector('.links');
  if (hash !== -1)
    req('/chapitres/chapitre'+hash+'.json', (chapitre: Chapitre) => {
      if (chapitre.err === undefined) {
        hideOrShow('.card > *');
        setTimeout(() => {
          if (chapitre.links.length === 0) {
            maintext.classList.toggle('theEnd', true);
          } else {
            maintext.classList.toggle('theEnd', false);
          }
          maintext.innerHTML = chapitre.txt;
          choices.innerHTML = "";
          for (let link of chapitre.links) {
            let span: Element = document.createElement('span');
            span.innerHTML = link.txt.replace(/([0-9]+)$/, '<em>$1</em>');
            span.setAttribute('data-target', link.link);
            span.addEventListener('click', onLink);
            choices.appendChild(span);
          }
          hideOrShow('.card > *');
        }, 250);
      }
    });
}

// Naviguer dans le jeu
function onLink() {
  window.location.hash = this.getAttribute('data-target');
  actualise();
}

// Afficher ou masquer un élément
function hideOrShow(sel: string) {
  let all = document.querySelectorAll(sel);
  all.forEach((el: Element) => {
    el.classList.toggle('hide');
  });
}

// Requête GET / POST
function req(url: string, callback: Function) {
  let req = new XMLHttpRequest();
  req.open('GET', url);
  req.onerror = function() {
    callback({err:"Erreur de chargement",dataerr:url});
  }
  req.onload = function() {
    if (req.status === 200) {
      let data = JSON.parse(req.responseText);
      callback(data);
    } else {
      callback({err:"Erreur",dataerr:req.status});
    }
  };
  req.send();
}

class Link {
  link: string;
  txt: string;
}

class Chapitre {
  links: Array<Link>;
  txt: string;
  err: string;
  dataerr: string;
}
