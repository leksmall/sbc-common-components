//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
// the License. You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
// an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.
//

import Vue from 'vue'
import Vuetify from 'vuetify'

import { mount, Wrapper } from '@vue/test-utils'

import BaseAddress from '@/components/BaseAddress.vue'

Vue.use(Vuetify)

let vuetify = new Vuetify({})
// Boilerplate to prevent the complaint "[Vuetify] Unable to locate target [data-app]"
const app: HTMLDivElement = document.createElement('div')
app.setAttribute('data-app', 'true')
document.body.append(app)

// The basic and valid Canadian address used for testing the component.
const basicAddress: object = {
  streetAddress: '1234 Main St',
  streetAddressAdditional: 'PO BOX STN PROV GOV',
  addressCity: 'Victoria',
  addressRegion: 'BC',
  postalCode: 'V8W 3J3',
  addressCountry: 'Canada',
  deliveryInstructions: 'c/o The Management'
}

// A different street to test address changes.
const differentStreet: string = '13 Pig Sty Alley'

// Input field selectors to test changes to the DOM elements.
const streetAddressSelector: string = '[name="street-address"]'
const deliveryInstructionsSelector: string = '[name="delivery-instructions"]'

/**
 * Returns the last event for a given name, to be used for testing event propagation in response to component changes.
 *
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 *
 * @return the value of the last named event for the wrapper.
 */
function getLastEvent (wrapper: Wrapper<BaseAddress>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  const events: Array<any> = eventsList[eventsList.length - 1]

  return events[0]
}

/**
 * Creates and mounts a component, so that it can be tested.
 *
 * @param address an object containing the address for the component. The default value is the {@link basicAddress}.
 * @param editing a boolean that indicates whether the component should be in edit (true) or display (false) mode.
 *     Default value is true.
 *
 * @return a Wrapper<BaseAddress> object with the given parameters.
 */
function createComponent (address: object = { ...basicAddress }, editing: boolean = true): Wrapper<BaseAddress> {
  return mount(BaseAddress, { vuetify, propsData: { 'address': address, 'editing': editing } })
}

describe('BaseAddress.vue', () => {
  it('handles no address', () => {
    // Don't use createComponent, do it manually so the property can be missing.
    const wrapper: Wrapper<BaseAddress> = mount(BaseAddress, { vuetify })

    // The last "valid" event should indicate that the address is not valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).not.toBeTruthy()
  })

  it('handles an undefined address', () => {
    // Don't use createComponent, do it manually so the property can be undefined.
    const wrapper: Wrapper<BaseAddress> = mount(BaseAddress, { vuetify,
      propsData: { address: undefined }
    })

    // The last "valid" event should indicate that the address is not valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).not.toBeTruthy()
  })

  it('handles a null address', () => {
    const wrapper: Wrapper<BaseAddress> = createComponent(null)

    // The last "valid" event should indicate that the address is not valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).not.toBeTruthy()
  })

  it('handles an empty address', () => {
    const wrapper: Wrapper<BaseAddress> = createComponent({})

    // The last "valid" event should indicate that the address is not valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).not.toBeTruthy()
  })

  it('supports address object isolation', () => {
    const address: object = {}
    const wrapper: Wrapper<BaseAddress> = createComponent(address)

    const inputElement: Wrapper<Vue> = wrapper.find(streetAddressSelector)
    inputElement.setValue(basicAddress['streetAddress'])

    // The component should not be changing the property object.
    expect(address['streetAddress']).not.toEqual(basicAddress['streetAddress'])
  })

  it('displays a Canadian address', () => {
    const wrapper: Wrapper<BaseAddress> = createComponent(basicAddress, false)

    // We should be in display mode.
    expect(wrapper.find('.address-block').isVisible()).toBeTruthy()
    expect(wrapper.find('form[name="address-form"').isVisible()).not.toBeTruthy()

    // The last "valid" event should indicate that the address is valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).toBeTruthy()

    // Check that each of the fields appears in the display.
    expect(wrapper.find('.address-block').text()).toContain(basicAddress['streetAddress'])
    expect(wrapper.find('.address-block').text()).toContain(basicAddress['streetAddressAdditional'])
    expect(wrapper.find('.address-block').text()).toContain(basicAddress['addressCity'])
    expect(wrapper.find('.address-block').text()).toContain(basicAddress['addressRegion'])
    expect(wrapper.find('.address-block').text()).toContain(basicAddress['postalCode'])
    expect(wrapper.find('.address-block').text()).toContain(basicAddress['addressCountry'])
    expect(wrapper.find('.address-block').text()).toContain(basicAddress['deliveryInstructions'])
  })

  it('edits a Canadian address', () => {
    const wrapper: Wrapper<BaseAddress> = createComponent()

    // We should be in edit mode.
    expect(wrapper.find('.address-block').isVisible()).not.toBeTruthy()
    expect(wrapper.find('[name="address-form"').isVisible()).toBeTruthy()

    // The last "valid" event should indicate that the address is valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).toBeTruthy()

    // Check that each of the inputs contains the value.
    expect(wrapper.find('[name="street-address"]').element['value']).toEqual(
      basicAddress['streetAddress'])
    expect(wrapper.find('[name="street-address-additional"]').element['value']).toEqual(
      basicAddress['streetAddressAdditional'])
    expect(wrapper.find('[name="address-city"]').element['value']).toEqual(basicAddress['addressCity'])
    // TODO: Region
    expect(wrapper.find('[name="postal-code"]').element['value']).toEqual(basicAddress['postalCode'])
    expect(wrapper.find('[name="address-country"]').element['value']).toEqual(
      basicAddress['addressCountry'])
    expect(wrapper.find('[name="delivery-instructions"]').element['value']).toEqual(
      basicAddress['deliveryInstructions'])
  })

  it('is invalid with missing street', () => {
    const modifiedAddress: object = { ...basicAddress, streetAddress: '' }
    const wrapper: Wrapper<BaseAddress> = createComponent(modifiedAddress)

    // The last "valid" event should indicate that the address is not valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).not.toBeTruthy()
  })

  it('is valid with missing additional street', () => {
    const modifiedAddress: object = { ...basicAddress, streetAddressAdditional: '' }
    const wrapper: Wrapper<BaseAddress> = createComponent(modifiedAddress)

    // The last "valid" event should indicate that the address is valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).toBeTruthy()
  })

  it('is invalid with missing city', () => {
    const modifiedAddress: object = { ...basicAddress, addressCity: '' }
    const wrapper: Wrapper<BaseAddress> = createComponent(modifiedAddress)

    // The last "valid" event should indicate that the address is not valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).not.toBeTruthy()
  })

  it('is invalid with missing region', () => {
    const modifiedAddress: object = { ...basicAddress, addressRegion: '' }
    const wrapper: Wrapper<BaseAddress> = createComponent(modifiedAddress)

    // The last "valid" event should indicate that the address is not valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).not.toBeTruthy()
  })

  it('is invalid with missing postal code', () => {
    const modifiedAddress: object = { ...basicAddress, postalCode: '' }
    const wrapper: Wrapper<BaseAddress> = createComponent(modifiedAddress)

    // The last "valid" event should indicate that the address is not valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).not.toBeTruthy()
  })

  it('is invalid with missing country', () => {
    const modifiedAddress: object = { ...basicAddress, addressCountry: '' }
    const wrapper: Wrapper<BaseAddress> = createComponent(modifiedAddress)

    // The last "valid" event should indicate that the address is not valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).not.toBeTruthy()
  })

  test('is valid with missing delivery instructions', () => {
    const modifiedAddress: object = { ...basicAddress, deliveryInstructions: '' }
    const wrapper: Wrapper<BaseAddress> = createComponent(modifiedAddress)

    // The last "valid" event should indicate that the address is valid.
    expect(wrapper.emitted().valid).toBeDefined()
    expect(getLastEvent(wrapper, 'valid')).toBeTruthy()
  })

  it('is modified when the street changes', () => {
    const wrapper: Wrapper<BaseAddress> = createComponent()

    const inputElement: Wrapper<Vue> = wrapper.find(streetAddressSelector)
    inputElement.setValue(differentStreet)

    // The last "modified" event should indicate that the address has been modified.
    expect(wrapper.emitted().modified).toBeDefined()
    expect(getLastEvent(wrapper, 'modified')).toBeTruthy()
  })

  it('is unmodified when street modified then unmodified', () => {
    const wrapper: Wrapper<BaseAddress> = createComponent()

    const inputElement: Wrapper<Vue> = wrapper.find(streetAddressSelector)
    inputElement.setValue(differentStreet)
    inputElement.setValue(basicAddress['streetAddress'])

    // The last "modified" event should indicate that the address has not been modified.
    expect(wrapper.emitted().modified).toBeDefined()
    expect(getLastEvent(wrapper, 'modified')).not.toBeTruthy()
  })

  it('is unmodified when undefined field defined as empty', () => {
    const modifiedAddress: object = { ...basicAddress, deliveryInstructions: undefined }
    const wrapper: Wrapper<BaseAddress> = createComponent(modifiedAddress)

    const inputElement: Wrapper<Vue> = wrapper.find(deliveryInstructionsSelector)
    inputElement.setValue('')

    // The last "modified" event should indicate that the address has not been modified.
    expect(wrapper.emitted().modified).toBeDefined()
    expect(getLastEvent(wrapper, 'modified')).not.toBeTruthy()
  })

  it('sends an update:address when the form changes', () => {
    const wrapper: Wrapper<BaseAddress> = createComponent()

    const modifiedAddress: object = { ...basicAddress, streetAddress: differentStreet }

    const inputElement: Wrapper<Vue> = wrapper.find(streetAddressSelector)
    inputElement.setValue(differentStreet)

    // The "update:address" event should contain the new address, for syncing the model back in the parent.
    expect(wrapper.emitted()['update:address']).toBeDefined()
    expect(getLastEvent(wrapper, 'update:address')).toMatchObject(modifiedAddress)
  })

  it('changes the form when the model changes', () => {
    const addressToChange: object = { ...basicAddress }
    const wrapper: Wrapper<BaseAddress> = createComponent(addressToChange)

    addressToChange['streetAddress'] = differentStreet
    wrapper.setProps({ address: { ...addressToChange } })

    const inputElement: Wrapper<Vue> = wrapper.find(streetAddressSelector)

    expect(inputElement.element['value']).toEqual(differentStreet)
  })
})
