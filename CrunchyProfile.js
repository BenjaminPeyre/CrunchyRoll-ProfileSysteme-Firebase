const CRUNCHY_LOCAL_NAME = "Crunchy-Profile"
let log = console.log;
let logt = console.table;
let LectureHorsLigne = {"AnimeList": []}
// let AnimeSauvegardeTheme = {AnimeName: "" , EpisodeVue: []}
peuplementLectureHorsLigne()
// console.clear();
log('Crunchy-Profile-Connecter');
OberseBody();
addStyle();
//AddObserver()
function OberseBody(){

let observerBody = new MutationObserver(mutationRecords => {
  if(location.href.includes('https://beta.crunchyroll.com/fr/series/'))
    removeVue()
  if(location.href.includes('https://beta.crunchyroll.com/fr/watch/'))
    utilisateurRegardeUnAnime()
    
  /*if(mutationRecords[1].target.data) if(mutationRecords[1].target.data != null)*/
  // log(mutationRecords)
  // for (let i = 0; i < mutationRecords.length; i++) {
  //   const element = mutationRecords[i].target.data;
  //   //alert(element.target)
    
  // }
  try {
    if(mutationRecords[1].target.parentNode.className === "c-heading c-heading--xs c-heading--family-type-one title") {
      var episodeName = mutationRecords[1].target.data;
      log(episodeName)
    }    
  } catch (error) {
    log(error)
  }  
});


observerBody.observe(document.querySelector("body"), {
  childList: true, // observe direct children
  subtree: true, // and lower descendants too
  characterDataOldValue: true // pass old data to callback
});
}
function AddObserver(){

  try {
    Observer('h1');
    
  } catch (error) {
    Observer('h2');
    
  }
  //AddProfile
}
function NewAnime(NomAnime, NomDeEpisode) {
  let AnimeSauvegardeTheme = {AnimeName: NomAnime , EpisodeVue: [NomDeEpisode]}
  return AnimeSauvegardeTheme
}
function peuplementLectureHorsLigne() {
  if(localStorage.getItem(CRUNCHY_LOCAL_NAME))
    LectureHorsLigne = JSON.parse(localStorage.getItem(CRUNCHY_LOCAL_NAME))
  else(SauvegarderProfileList(LectureHorsLigne))
}
function SauvegarderProfileList(List){localStorage.setItem(CRUNCHY_LOCAL_NAME, JSON.stringify(List));};
function Observer(BaliseType){

let observer = new MutationObserver(mutationRecords => {
  //console.log(mutationRecords); // console.log(the changes)
});

// observe everything except attributes
observer.observe(document.querySelector(BaliseType), {
  childList: true, // observe direct children
  subtree: true, // and lower descendants too
  characterDataOldValue: true // pass old data to callback
});
}
function GetAnimeInfo(BaliseType){
  if(!location.href.includes('https://beta.crunchyroll.com/fr/watch')) return;
  if(!document.querySelector(BaliseType)) { return Error("existe pas");} 
let episodeName = document.querySelector(BaliseType).innerText;
let animeName = document.querySelector('div[class=current-media-parent-ref]').querySelector('h4').innerText;
let animeDic={"AnimeName": animeName, "EpisodeVue": episodeName};
return animeDic;
}
function utilisateurRegardeUnAnime()
{
  const ANIME_DIC_PAGE = GetAnimeInfo('h1')
  if(ANIME_DIC_PAGE.EpisodeVue == null) return;


  let animeVue = false;
  if(Array.isArray(LectureHorsLigne.AnimeList)){

    for (let i = 0; i < LectureHorsLigne.AnimeList.length; i++) {
    const localAnimeList = LectureHorsLigne.AnimeList[i];
    //L'utilisateur a vue l'anime.
    if(localAnimeList.AnimeName === ANIME_DIC_PAGE.AnimeName){
      animeVue = true;
      //l'utilisateur a pas vue cette episode 
      if(!localAnimeList.EpisodeVue.includes(ANIME_DIC_PAGE.EpisodeVue)){
        localAnimeList.EpisodeVue.push(ANIME_DIC_PAGE.EpisodeVue)
      }
    }
  }}else{
    alert(typeof LectureHorsLigne)
  }
  //l'utilisateur n'a pas vue l'anime.
  if(!animeVue) LectureHorsLigne.AnimeList.push(NewAnime(ANIME_DIC_PAGE.AnimeName, ANIME_DIC_PAGE.EpisodeVue))      
  SauvegarderProfileList(LectureHorsLigne)
  
  
}

function addStyle(){

  var style = document.createElement('style');
      style.innerHTML ='#Bouton-Profile-c {' +
          "background-color: Green"+
          '}';
  document.body.appendChild(style);
}
function removeVue() {
  //Attention pour la fonction attendre le chargement du profile sinon pas de le dernier episode vue par le profile.

  let listAnimeOb = new MutationObserver(mutationRecords => {

    function InfoAnime(Nom){
      let tab = null;
      LectureHorsLigne.AnimeList.forEach((e) =>{if (e.AnimeName === Nom) tab = e.EpisodeVue})
      return tab;
  }
  
  function InfoPageAnime(){
      let tab = [];
      document.querySelectorAll('div.c-playable-card__body').forEach((e) =>tab.push(e.querySelector('h4')))
      return tab;
  }
  let parentVerif=[]
  InfoPageAnime().forEach((unEpisode)=>{
  
              InfoAnime(document.querySelector('h1').innerText).forEach((UnEpisodeDejaVu) =>{
  
                      if(unEpisode.innerText.includes(UnEpisodeDejaVu)){
                        //{unEpisode.hidden = true}
                          parentVerif.push(unEpisode.parentElement.parentElement)
                        unEpisode.parentElement.parentElement.querySelector('div.c-playable-thumbnail-icon').hidden = false;}
                      else if(!parentVerif.includes(unEpisode.parentElement.parentElement)) {
                       unEpisode.parentElement.parentElement.querySelector('div.c-playable-thumbnail-icon').hidden = true; }
  
          })
  })
  
    //BoutonRegarder()
  });//Fin Observer
  try {
      // observe everything except attributes
  listAnimeOb.observe(document.querySelector("div.erc-season-with-navigation"), {
    childList: true, // observe direct children
    subtree: true, // and lower descendants too
    characterDataOldValue: true // pass old data to callback
  });
  } catch (error) {
    
  }

}//removeVue
/*
function BoutonRegarder(){
  let divParent = document.querySelector('div.up-next-section')
  divParent.querySelectorAll('a').forEach((e) => e.href = "https://www.google.fr")
  let boutonWatching = divParent.querySelector('a[data-t=continue-watching-btn]')
  boutonWatching.href = "https://www.google.fr";
  boutonWatching.target = "_blank";
  boutonWatching.style.backgroundColor = "red"
  log("Bouton Modifier")

}*/
function Fusion(DonnéesFirebase, DonnéesLocal){
  let Dic_Fusion = {AnimeList: []};
    if(JSON.stringify(DonnéesFirebase) === JSON.stringify(DonnéesLocal)){
      console.log("Pas De Nouveaux Anime")
      Dic_Fusion= DonnéesLocal;
    }
    else{
      // logt(DonnéesFirebase.AnimeList)
      // logt(DonnéesLocal.AnimeList)
      for (let key2 = 0; key2 < DonnéesFirebase.AnimeList.length; key2++) {
        const UneDonnéesFirebase = DonnéesFirebase.AnimeList[key2]
        for (let key1 = 0; key1 < DonnéesLocal.AnimeList.length; key1++) {
          const uneDonnéesLocal = DonnéesLocal.AnimeList[key1]
          //ajouter les nouveaux episodes  
          if(UneDonnéesFirebase.AnimeName===uneDonnéesLocal.AnimeName)
            {
              let ArrayEpisodeVue = UneDonnéesFirebase.EpisodeVue.concat(uneDonnéesLocal.EpisodeVue).sort()
              let filter =  [...new Set(ArrayEpisodeVue)]
              Dic_Fusion.AnimeList.push({AnimeName: UneDonnéesFirebase.AnimeName,  EpisodeVue: filter})
            }
        }
    }
    for (let i = 0; i < DonnéesFirebase.AnimeList.length; i++) {
      // const DonnéesFirebase = DonnéesFirebase.AnimeList[i];
      //L'utilisateur a vue l'anime.
      let animeVue = false;
      for (let key1 = 0; key1 < DonnéesLocal.AnimeList.length; key1++) {
        if(DonnéesLocal.AnimeList[key1].AnimeName === DonnéesFirebase.AnimeList[i].AnimeName){
          animeVue = true;
        }
      }
      //  l'historique de lanime n'est pas dans stocker sur le pc 
      if(!animeVue){
        // console.log("L'anime: " + DonnéesFirebase.AnimeList[i].AnimeName + "n'est pas vue")
        Dic_Fusion.AnimeList.push(DonnéesFirebase.AnimeList[i])
      } 
    }

    }//Fin creation Dic_Fusion
    SauvegarderProfileList(Dic_Fusion);

}//Fusion()

function LocalInfoAnime(Nom){
    return LectureHorsLigne.AnimeList.forEach((e) =>{if (e.AnimeName === Nom) log(e.EpisodeVue)})
  }
  function InfoPageAnime(){
    let tab = [];
    document.querySelectorAll('div.c-playable-card__body').forEach((e) =>tab.push(e.querySelector('h4').innerHTML))
    return tab;
}
//Communication popup
chrome.runtime.onMessage.addListener(
      function(message, sender, sendResponse) {
          switch(message.type) {
              case "PCVersLaBD":
                  log("J'envoie la la db: ", localStorage.getItem(CRUNCHY_LOCAL_NAME))
                  sendResponse(localStorage.getItem(CRUNCHY_LOCAL_NAME));
                  
              break;
              case "log":
                log(message);
                //log(JSON.stringify(message.message));
              break;
              case "BDVersPC":
                log("Un Communication de le popup \n" + JSON.stringify(message))
                  //message.message et un object
                  if(message.message != undefined ){            
                    Fusion(message.message,  LectureHorsLigne)
                    location.reload()
                  }else{
                    sendResponse("Renv")
                  }
              break;
          }
          
      }
);
/*c-progress-bar c-playable-thumbnail__progress-bar */
/*    document.querySelectorAll('div.c-playable-card__body')[0].querySelector('h4').innerHTML === "E3 - **" */