'use strict';

const NS = 'com.evec';

/* global getAssetRegistry getParticipantRegistry getFactory */

/**
 *
 * @param {com.evec.FillContainer} fillContainer - model instance
 * @transaction
 */
async function onFillContainer(fillContainer) {
    console.log('onFillContainer');

    // set the container substance and substance owner
    fillContainer.container.substance = fillContainer.substance;
    fillContainer.substance.currentOwner = fillContainer.container.owner;

    let currentOwner = fillContainer.currentOwner.company;
    let newOwner = fillContainer.receiver.company;

    increaseReputation(currentOwner, newOwner);

     // save the container
    const car = await getAssetRegistry(NS + '.Container');
    await car.update(fillContainer.container);

    // save the substance 
    const sar = await getAssetRegistry(NS + '.OwnedSubstance');
    await sar.update(fillContainer.substance);
}

/**
 *
 * @param {com.evec.LoadVehicle} loadVehicle - model instance
 * @transaction
 */
async function onLoadVehicle(loadVehicle) {
    console.log('onLoadVehicle');

    // set the container substance and substance owner
    loadVehicle.vehicle.container = loadVehicle.container;
    loadVehicle.container.substance.currentOwner = loadVehicle.receiver.company;

    let currentOwner = loadVehicle.currentOwner.company;
    let newOwner = loadVehicle.receiver.company;

    await increaseReputation(currentOwner, newOwner);
    
     // save the vehicle
    const ar = await getAssetRegistry(NS + '.Vehicle');
    await ar.update(loadVehicle.vehicle);

    // save the substance 
    const sar = await getAssetRegistry(NS + '.OwnedSubstance');
    await sar.update(loadVehicle.container.substance);
}

async function increaseReputation(currentOwner, newOwner){
    if (currentOwner.id !== newOwner.id) {
        currentOwner.reputation++;
        newOwner.reputation++;
    
        const oar = await getParticipantRegistry(NS + '.Company');
        await oar.update(currentOwner);
        await oar.update(newOwner);
    }
}