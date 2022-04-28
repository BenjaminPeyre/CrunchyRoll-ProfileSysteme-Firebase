    const log = console.log
    // Import the functions you need from the SDKs you need
    import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
    import { getDatabase, ref, set,onValue } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";
    
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
     
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
      };
    // Creation des constants
    
    //boutons
    const BOUTON_CONNECTION = document.querySelector('button#connection')
    const BOUTON_CHANGER_PROFILE = document.querySelector('button#ChangerProfile')
    const BOUTON_NOUVEAU_PROFILE = document.querySelector('button#nouveauxProfile')
    const BOUTON_TELECHARGER_ANIMELIST = document.querySelector('button#TelechargerVosAnimesVue')
    const BOUTON_ENVOIE_ANIMELIST = document.querySelector('button#EnvoieVotreListeDanimeVue')


    //Text
    const InputProfileName = document.querySelector('input#ProfileName')
    const TitleText = document.querySelector('#Title')
    const LOG_LABEL = document.querySelector('label#log')
    let session_Username;
    
    
    // Ajout des evenements cick
    BOUTON_CONNECTION.addEventListener('click', ()=> connection(InputProfileName.value))
    BOUTON_CHANGER_PROFILE.addEventListener('click', ()=>{localStorage.setItem('CrunchyProfile', ""); utilisateurConnecter(false)}  )
    BOUTON_NOUVEAU_PROFILE.addEventListener('click', () =>{NouveauxProfile(InputProfileName.value) })
    BOUTON_ENVOIE_ANIMELIST.addEventListener('click', ()=>{SynchroniserLesDonnéesPCVersLaBD() })
    BOUTON_TELECHARGER_ANIMELIST.addEventListener('click', ()=>{SynchroniserLesDonnéesBDVersLePC()})

    //BOUTON_SyncDB.addEventListener('click', ()=>{SynchroniserLesDonnéesPCVersLaBD})
    let estConnecter = false;
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);  
    const db = getDatabase();


    log(app)
    log(db)

    if(localStorage.getItem('CrunchyProfile')){  
        utilisateurConnecter(true)        
    }

    // Set data
    function ajouteraFireBase(données, profile){
        set(ref(db, "Profile/"+profile), données);
    }

    function logLabel(elem){
        //Ecrire dans le label LOG
        LOG_LABEL.innerText = elem
    }
    function utilisateurConnecter(bool){
        if(bool){
            InputProfileName.value = localStorage.getItem('CrunchyProfile');
            estConnecter = true;
            BOUTON_CONNECTION.hidden=true;
            BOUTON_NOUVEAU_PROFILE.hidden=true
            BOUTON_CHANGER_PROFILE.hidden=false;
            TitleText.innerText = "Bonjour " + localStorage.getItem('CrunchyProfile');
            logLabel("Bonjour " + localStorage.getItem('CrunchyProfile'))
            BOUTON_TELECHARGER_ANIMELIST.hidden = false; 
            BOUTON_ENVOIE_ANIMELIST.hidden = false;
            session_Username = localStorage.getItem('CrunchyProfile');
        }else{
            BOUTON_TELECHARGER_ANIMELIST.hidden = true; 
            BOUTON_ENVOIE_ANIMELIST.hidden = true;;
            BOUTON_CHANGER_PROFILE.hidden=true;
            InputProfileName.value = "";
            estConnecter = false;
            BOUTON_NOUVEAU_PROFILE.hidden=false
            BOUTON_CONNECTION.hidden=false;
            TitleText.innerText = "Connection: ";
        }
    }
    function SynchroniserLesDonnéesPCVersLaBD(){
        log("Demande a la page les données")
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type:"PCVersLaBD", msg: "stp"}, function(response){
                log(response)
                let parseResponse = JSON.parse(response)
                ajouteraFireBase(parseResponse, session_Username)
            });
        });
    }
    function SynchroniserLesDonnéesBDVersLePC(){    
            let DonnéesDeFireBase;
            onValue(ref(db, "Profile/"+ session_Username), (snapshot) => {
                if(!snapshot) return;
                const data = snapshot.val()
                log('Resumer de la database', data)
                DonnéesDeFireBase = data;
            ;})
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {message: DonnéesDeFireBase, type: "BDVersPC"}, function(r){
                    if(r === "Renv") SynchroniserLesDonnéesBDVersLePC()   
                });
            });
        
    }
    function connection(Username) {
        ajoutlocalStorage(Username)
        if(!estDansDB(Username)){
            logLabel(`L'utilisateur ${Username} n'existe pas`);
        }
        else{
            logLabel(`Connecter en tant que ${Username}`)
            estConnecter = true;
        } 
        //AjoutDeLaBDVersNavigateur({type: "login",username: InputProfileName.value }); 
    }
    function NouveauxProfile(Username){
        logLabel(`tentative D'ajout de ${Username} a la base de données`)
        //ajouteraFireBase({"AnimeVue": []}, Username)
        //Ici les valeurs sont null en string car firebase delete les tableaux et dic vide
        set(ref(db, "Profile/" + Username), {
            AnimeList: [{AnimeName: "null", EpisodeVue: ["null"]}]
          });
        logLabel(`${Username} ajouté la base de données`)
    }


    function estDansDB(Username) {        
        onValue(ref(db, "Profile"), (snap) =>{    
            log("Voici le snap.val(): \n")      
            if(snap.val()[Username]){              
                log(snap.val()[Username])
                utilisateurConnecter(true)
            }                  
            else{               
                log(Username + " N'est pas dans la DB")
                InputProfileName.focus()
                utilisateurConnecter(false)
            }             
        })     
    } 
    function ajoutlocalStorage(Username){
        localStorage.setItem('CrunchyProfile', Username)
        //ajouteraFireBase({Username: []})
    }