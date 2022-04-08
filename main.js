document.addEventListener('DOMContentLoaded', function () {
    // Page d'accueil
    document.querySelector('span[data-target="#1"]').addEventListener('click', onLink);
    actualise();
});
// Réecrire le pull-to-reload pour recommencer l'aventure
var _startY;
document.body.addEventListener('touchstart', function (e) {
    _startY = e.touches[0].pageY;
}, { passive: true });
document.body.addEventListener('touchmove', function (e) {
    var y = e.touches[0].pageY;
    if (document.scrollingElement.scrollTop === 0 && y > _startY) {
        document.location.href = "/";
    }
}, { passive: true });
document.onkeyup = function (e) {
    // f5, backspace, escape
    if ([116, 8, 27].indexOf(e.keyCode) !== -1) {
        e.preventDefault();
        document.location.href = "/";
    }
};
// Contenu de la page
function actualise(precise) {
    var hash = precise || window.location.hash.split('#')[1] || -1;
    var maintext = document.querySelector('.maintext');
    var choices = document.querySelector('.links');
    if (hash !== -1)
        req('/chapitres/chapitre' + hash + '.json', function (chapitre) {
            if (chapitre.err === undefined) {
                hideOrShow('.card > *');
                setTimeout(function () {
                    if (chapitre.links.length === 0) {
                        maintext.classList.toggle('theEnd', true);
                    }
                    else {
                        maintext.classList.toggle('theEnd', false);
                    }
                    maintext.innerHTML = chapitre.txt;
                    choices.innerHTML = "";
                    for (var _i = 0, _a = chapitre.links; _i < _a.length; _i++) {
                        var link = _a[_i];
                        var span = document.createElement('span');
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
function hideOrShow(sel) {
    var all = document.querySelectorAll(sel);
    all.forEach(function (el) {
        el.classList.toggle('hide');
    });
}
// Requête GET / POST
function req(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onerror = function () {
        callback({ err: "Erreur de chargement", dataerr: url });
    };
    req.onload = function () {
        if (req.status === 200) {
            var data = JSON.parse(req.responseText);
            callback(data);
        }
        else {
            callback({ err: "Erreur", dataerr: req.status });
        }
    };
    req.send();
}
var Link = /** @class */ (function () {
    function Link() {
    }
    return Link;
}());
var Chapitre = /** @class */ (function () {
    function Chapitre() {
    }
    return Chapitre;
}());
