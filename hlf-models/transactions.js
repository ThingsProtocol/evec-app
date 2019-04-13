'use strict';

const NS = com.evec;

/* global getAssetRegistry getParticipantRegistry getFactory */

/**
 *
 * @param {com.evec.ProduceSubstance} produceSubstance - model instance
 * @transaction
 */
async function onProduceSubstance(produceSubstance) {
    console.log('onProduceProduct');
    const factory = getFactory();

    const ownedSubstance = factory.newResource(NS, 'OwnedSubstance')

    const ownedSubstanceRegistry = await getParticipantRegistry(NS + '.OwnedSubstance');
    await ownedSubstanceRegistry.add(ownedSubstance);
}

/**
 *
 * @param {com.evec.FillContainer} fillContainer - model instance
 * @transaction
 */
async function onFillContainer(fillContainer) {
    console.log('onFillContainer');

    if (fillContainer.filler.id === fillContainer.receiver.id) {
        throw new Error('filler and receiver can\'t be the same person');
    }

     // set the container substance and substance owner
    fillContainer.container.substance = fillContainer.substance;
    fillContainer.substance.currentOwner = fillContainer.container.owner;

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
    console.log('onFillContainer');

    if (loadVehicle.loader.id === loadVehicle.receiver.id) {
        throw new Error('loader and receiver can\'t be the same person');
    }

     // set the container substance and substance owner
    loadVehicle.vehicle.container = loadVehicle.container;
    loadVehicle.container.substance.currentOwner = loadVehicle.vehicle.driver.company;

     // save the vehicle
    const ar = await getAssetRegistry(NS + '.Vehicle');
    await ar.update(loadVehicle.vehicle);

    // save the substance 
    const sar = await getAssetRegistry(NS + '.OwnedSubstance');
    await sar.update(loadVehicle.container.substance);
}