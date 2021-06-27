// ==UserScript==
// @name         Pokeclicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.pokeclicker.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var autoClickDisabled = true;
    var autoFarmDisabled = true;
    var autoEggDisabled = true;
    var autoMineDisabled = true;
    window.toggleClicker = function() {
        autoClickDisabled = !autoClickDisabled
        if (autoClickDisabled){
            document.getElementById("autoClick").innerText = 'AutoClick';
            clearInterval(window.autoClick);
        } else {
            document.getElementById("autoClick").innerText = 'Stop AutoClick';
            window.autoClick = setInterval(function(){
                if(App.game.gameState == 2){
                    Battle.clickAttack();
                }
                else if(App.game.gameState == 3){
                    GymBattle.clickAttack();
                }
                else if(App.game.gameState == 4){
                    DungeonBattle.clickAttack();
                    DungeonRunner.openChest();
                    DungeonRunner.startBossFight();
                }
            },20);
        }
    }
    window.toggleFarm = function() {
        autoFarmDisabled = !autoFarmDisabled
        if(autoFarmDisabled){
            document.getElementById("autoFarm").innerText = 'AutoFarm';
        }
        else document.getElementById("autoFarm").innerText = 'Stop AutoFarm';
    }
    window.autoFarm = setInterval(function(){
        if (autoFarmDisabled) return;
        let count = App.game.farming.unlockedPlotCount();
        for(let p = 0;p < count; p++){
            if(App.game.farming.plotList[p].timeLeft <= 0 && App.game.farming.plotList[p].isUnlocked){
                App.game.farming.harvest(p,true);
                App.game.farming.plant(p,FarmController.selectedBerry);
            }
        }},500);
    window.toggleEgg = function() {
        autoEggDisabled = !autoEggDisabled
        if(autoEggDisabled){
            document.getElementById("autoEgg").innerText = 'AutoEgg';
        }
        else document.getElementById("autoEgg").innerText = 'Stop AutoEgg';
    }
    window.autoEgg = setInterval(function(){
        if (autoEggDisabled) return;
        for(let s = 0; s < App.game.breeding.eggSlots; s ++){
            if(App.game.breeding.eggList[s]().canHatch()){
                App.game.breeding.hatchPokemonEgg(s);
            }
        }
        if(App.game.breeding.hasFreeEggSlot() && BreedingController.breedableList().length > 0){
            BreedingController.filterBreedableList();
            var breedingListSorted = BreedingController.breedableList().sort((a,b) => b.baseAttack - a.baseAttack);
            App.game.breeding.gainPokemonEgg(breedingListSorted[0]);
        }
    },2000);
    window.toggleMine = function() {
        autoMineDisabled = !autoMineDisabled
        if(autoMineDisabled){
            document.getElementById("autoMine").innerText = 'AutoMine';
        }
        else document.getElementById("autoMine").innerText = 'Stop AutoMine';
    }
    window.autoMine = setInterval(function(){
        if (autoMineDisabled) return;
        if(Underground.energy >= 10){
            Mine.bomb(10)
        }
    },500);
    var node = document.querySelector("div.col.no-gutters.clickable").parentNode.parentNode.parentNode
    node.innerHTML += ('<button id="autoClick" style="color:black" onclick="toggleClicker()">AutoClick</button>');
    node.innerHTML += ('<button id="autoFarm" style="color:black" onclick="toggleFarm()">AutoFarm</button>');
    node.innerHTML += ('<button id="autoEgg" style="color:black" onclick="toggleEgg()">AutoEgg</button>');
    node.innerHTML += ('<button id="autoMine" style="color:black" onclick="toggleMine()">AutoMine</button>');
})();
