<script>
import axios from "axios";

export default {
    el: '#app',
    name: "Weather",
    data() {
        const lang = localStorage.getItem('lang') || 'fr';
        return {
            lang: lang,
            requete: "",
            favorites: [],
            dates: [],
            result_research_new: undefined,
            result_research_forcast: undefined,
            //api_code à demander
            api_code: "",
            url_research_new: "https://api.openweathermap.org/data/2.5/weather?",
            url_research_forcast: "https://api.openweathermap.org/data/2.5/forecast?"
        }
    },
    created() {
        //recevoir l'événement avec la charge nécessaire et appel à la fonction specifiée
        this.emitter.on('yes_call', (evt) => {
            this.yesEvent = evt.yesContent;
            this.yes(this.yesEvent)
        }),
            this.emitter.on('no_call', (evt) => {
                this.noEvent = evt.noContent;
                this.no(this.noEvent)
            })
    },
    methods: {
        yes(param) {
            try {
                //vérifier si on récupère un paramètre dans la fonction
                if (param.favorite !== undefined) {
                    this.requete = param.favorite
                }

                //afficher la div pour forcast
                if (this.$el.querySelector(".forcast") !== null) {
                    this.$el.querySelector(".forcast").setAttribute("style", "display: block")
                }

                //vérifier si le parametre de la requette est vide pour aficher un message d'erreur
                if (this.requete == "") {
                    this.$el.querySelector(".message").innerText = this.$t('required_rield');
                } else {
                    //récupérer et traiter la requête
                    axios.get(
                        `${this.url_research_forcast}q=${this.requete}&appid=${this.api_code}&lang=${this.lang}`
                    )
                        .then(
                            (response) => {
                                //enregistrer la réponse dans la variable si la requête est validée sinon message d'erreur
                                this.result_research_forcast = response.data
                                //trier la date pour pouvoir travailler sur l'affichage
                                for (const key in this.result_research_forcast.list) {
                                    //let date = new Date(this.result_research_forcast.list[key].dt * 1000).toLocaleDateString("fr-FR");
                                    let date = (this.result_research_forcast.list[key].dt_txt).slice(0, 10);
                                    if (this.dates.indexOf(date) === -1) {
                                        this.dates.push(date);
                                    }
                                }
                                //affichage message d'indication
                                this.$el.querySelector(".message").innerHTML = '<i class="fa-solid fa-arrow-down-long"></i>';
                            })
                        .catch(error => {
                            //afficher message d'erreur si la requette est introuvable
                            this.$el.querySelector(".message").innerText = this.$t('city_not_found');

                            console.log("Erreur 1. Veuillez vérifier le tableau d'errors !");
                            /*if (error.response) {
                                console.log(error.response.data);
                                console.log(error.response.status);
                                console.log(error.response.headers);
                            } else if (error.request) {
                                console.log(error.request);
                            } else {
                                console.log('Error', error.message);
                            }*/
                        })
                }

                //vider la requette
                this.requete = ""
                //vider la div new si elle existe
                if (this.$el.querySelector(".new") != null) {
                    this.$el.querySelector(".new").style.display = "none";
                }
            } catch (error) {
                console.log("Erreur 2. Veuillez vérifier le tableau d'errors !");
            }
        },

        no(param) {
            try {
                //vérifier si on récupère un paramètre dans la fonction
                if (param.favorite !== undefined) {
                    this.requete = param.favorite
                }

                //vérifier si le parametre de la requette est vide pour aficher un message d'erreur
                if (this.$el.querySelector(".message") !== null) {
                    this.$el.querySelector(".message").innerText = "";
                }

                //afficher la div pour new
                if (this.$el.querySelector(".new") !== null) {
                    this.$el.querySelector(".new").setAttribute("style", "display: block")
                }

                //vérifier si le parametre de la requette est vide pour aficher un message d'erreur
                if (this.requete == "") {
                    this.$el.querySelector(".message").innerText = this.$t('required_rield');
                } else {
                    //récupérer et traiter la requête
                    axios
                        .get(`${this.url_research_new}q=${this.requete}&units=metric&appid=${this.api_code}&lang=${this.lang}`)
                        .then(response => {
                            //enregistrer la réponse dans la variable si la requête est validée sinon message d'erreur
                            this.result_research_new = response.data
                            this.$el.querySelector(".message").innerHTML = '<i class="fa-solid fa-arrow-down-long"></i>';
                        })
                        .catch(error => {
                            this.$el.querySelector(".message").innerText = this.$t('city_not_found');
                            console.log("Erreur 3. Veuillez vérifier le tableau d'errors !");
                            /*if (error.response) {
                                console.log(error.response.data);
                                console.log(error.response.status);
                                console.log(error.response.headers);
                            } else if (error.request) {
                                console.log(error.request);
                            } else {
                                console.log('Error', error.message);
                            }*/
                        })
                }
                //vider la requette
                this.requete = ""
                //vider la div forcast si elle existe
                if (this.$el.querySelector(".forcast") != null) {
                    this.$el.querySelector(".forcast").style.display = "none"
                }

            } catch (error) {
                console.log("Erreur 4. Veuillez vérifier le tableau d'errors !");
            }
        },

        //ajouter aux favoris pour la météo actuelle
        addFavorit(param) {
            //faire un filtre pour les doublons
            if (!this.favorites.includes(param.result_research_new.name)) {
                //ajouter dans le tableau les éléments
                this.favorites.push(param.result_research_new.name)
                //enregistrer dans le local storage
                localStorage.setItem('favorites', JSON.stringify(this.favorites))
            }
        },

        //ajouter aux favoris pour la météo sur 5 jours
        addFavoritForcast(param) {
            //faire un filtre pour les doublons
            if (!this.favorites.includes(param.result_research_forcast.city.name)) {
                //ajouter dans le tableau les éléments
                this.favorites.push(param.result_research_forcast.city.name)
                //enregistrer dans le local storage
                localStorage.setItem('favorites', JSON.stringify(this.favorites))
            }
        },

        //changer la langue
        languageChange(event) {
            localStorage.setItem("lang", event.target.value);
            location.reload();
        }
    }
}

</script>

<template>
    <div>
        <div class="language">
            <label for="language" v-bind:title="$t('languages')"><i class="fa-solid fa-earth-americas"></i></label>
            <select name="language" id="language" v-model="lang" @change="languageChange($event)">
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
            </select>
        </div>

        <div class="section">
            <div class="recherche">
                <h1 class="m-20 title">{{ $t("title") }}</h1>
                <div class="m-20">
                    <input type="text" name="ville" id="ville" v-model="requete" v-bind:placeholder="$t('placeholder')"
                        :aria-label="$t('placeholder')">
                </div>
                <h2 class="m-20 title-2">{{ $t("subtitle") }}</h2>
                <div class="m-20">
                    <button type="button" v-on:click="yes" class="btn">{{ $t("btn_yes") }}</button>
                    <button type="button" v-on:click="no" class="btn">{{ $t("btn_no") }}</button>
                </div>
                <!-- afficher message errors/success -->
                <p class="message"></p>
            </div>
            <div v-if="favorites.length != 0" class="favorites">
                <h2>{{$t("favorites")}}</h2>
                <ul class="list">
                    <li v-for="favorite in favorites">
                        {{ favorite }}
                    </li>
                </ul>
            </div>
        </div>

        <!-- météo actuelle -->
        <div v-if="result_research_new" class="new">
            <button type="button" v-on:click="addFavorit({result_research_new})" class="btn  btn_favorite">
                {{ $t("btn_add") }} {{result_research_new.name}}</button>
            <h2 class="caption">{{result_research_new.name}}</h2>
            <div class="card-row">
                <div class="card m-20">
                    <div class="m-20">
                        <h2 title="Date"><i class="fa-solid fa-calendar-days"></i>
                            {{ new Date(result_research_new.dt * 1000).toLocaleDateString("fr-FR") }}
                        </h2>
                    </div>

                    <div class="m-20">
                        <h2 v-bind:title="$t('hour')">
                            <i class="fa-regular fa-clock"></i>
                            {{ new Date(result_research_new.dt * 1000).toLocaleTimeString("fr-FR") }}
                        </h2>
                    </div>

                    <div class="title m-20">
                        <h2 v-bind:title="$t('temp')">
                            <i class="fa-solid fa-temperature-half"></i>
                            {{result_research_new.main.temp}} °C
                        </h2>
                    </div>

                    <div class="inline m-20">
                        <h3 v-bind:title="$t('temp_min')">
                            <i class="fa-solid fa-temperature-arrow-down"></i>
                            {{result_research_new.main.temp_min}} °C
                        </h3>
                        <br>
                        <h3 v-bind:title="$t('temp_max')">
                            <i class="fa-solid fa-temperature-arrow-up"></i>
                            {{result_research_new.main.temp_max}} °C
                        </h3>
                    </div>

                    <div class="m-20 title-2 italic">
                        <h3 class="Ciel" v-bind:title="$t('sky')">
                            <i class="fa-brands fa-skyatlas"></i> {{result_research_new.weather[0].description}}
                        </h3>
                    </div>

                    <div class="inline m-20">
                        <h3 v-bind:title="$t('humidity')">
                            <i class="fa-solid fa-droplet"></i>
                            {{result_research_new.main.humidity}} %
                        </h3>
                        <br>
                        <h3 v-bind:title="$t('pressure')"><i class="fa-solid fa-minimize"></i>
                            {{result_research_new.main.pressure}} mb
                        </h3>
                    </div>

                    <div class="m-20">
                        <h3 v-bind:title="$t('wind')"><i class="fa-solid fa-wind"></i>
                            {{result_research_new.wind.speed}} m/s</h3>
                    </div>

                    <div class="m-20">
                        <h3 v-bind:title="$t('visibility')"><i class="fa-regular fa-eye"></i>
                            {{result_research_new.visibility /1000}} km</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- méteo sur 5 jours -->
        <div v-if="result_research_forcast" class="forcast">
            <h2 class="caption">{{$t('caption')}} {{result_research_forcast.city.name}}</h2>
            <button type="button" v-on:click="addFavoritForcast({result_research_forcast})" class="btn btn_favorite">
                {{ $t("btn_add") }} {{result_research_forcast.city.name}}</button>
            <p class="describe">{{$t('describe')}}</p>
            <div>
                <div v-for="date in dates">
                    <h2 class="caption">{{date.slice(8,10)}}/{{date.slice(5,7)}}/{{date.slice(0,4)}}</h2>
                    <div class="flex-inline">
                        <div v-for="result in result_research_forcast.list">
                            <div v-if="date == result.dt_txt.slice(0,10)" class="card m-20">
                                <div class="m-20">
                                    <h2 title="Date"><i class="fa-solid fa-calendar-days"></i>
                                        {{ new Date(result.dt * 1000).toLocaleDateString("fr-FR") }}</h2>
                                </div>

                                <div class="m-20">
                                    <h2 v-bind:title="$t('hour')"><i class="fa-regular fa-clock"></i>
                                        {{ new Date(result.dt * 1000).toLocaleTimeString("fr-FR") }}</h2>
                                </div>

                                <div class="title m-20">
                                    <h2 v-bind:title="$t('temp')"><i class="fa-solid fa-temperature-half"></i>
                                        {{(result.main.temp - parseFloat(273,15)).toFixed(1)}} °C</h2>
                                </div>

                                <div class="inline m-20">
                                    <h3 v-bind:title="$t('temp_min')"><i class="fa-solid fa-temperature-arrow-down"></i>
                                        {{(result.main.temp_min - parseFloat(273,15)).toFixed(1)}} °C</h3>
                                    <br>
                                    <h3 v-bind:title="$t('temp_max')"><i class="fa-solid fa-temperature-arrow-up"></i>
                                        {{(result.main.temp_max - parseFloat(273,15)).toFixed(1)}} °C</h3>
                                </div>

                                <div class="m-20 title-2 italic">
                                    <h3 v-bind:title="$t('sky')"><i class="fa-brands fa-skyatlas"></i>
                                        {{result.weather[0].description}}
                                    </h3>
                                </div>

                                <div class="inline m-20">
                                    <h3 v-bind:title="$t('humidity')"><i class="fa-solid fa-droplet"></i>
                                        {{result.main.humidity}} %</h3>
                                    <br>
                                    <h3 v-bind:title="$t('pressure')"><i class="fa-solid fa-minimize"></i>
                                        {{result.main.pressure}} mb</h3>
                                </div>

                                <div class="m-20">
                                    <h3 v-bind:title="$t('wind')"><i class="fa-solid fa-wind"></i>
                                        {{result.wind.speed}} m/s</h3>
                                </div>

                                <div class="m-20">
                                    <h3 v-bind:title="$t('visibility')"><i class="fa-regular fa-eye"></i>
                                        {{result.visibility /1000}} km</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>