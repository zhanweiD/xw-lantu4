import {createPropertyModel} from '@exhibit-collection/create-exhibit-property-class'
import {layout, remark, material, backgroundColor} from '../../exhibit-option-system/panels'

export const MLayout = createPropertyModel('property', layout, 'layout')
export const MBackgroundColor = createPropertyModel('property', backgroundColor, 'backgroundColor')
export const MRemark = createPropertyModel('property', remark, 'remark')
export const MMaterial = createPropertyModel('property', material, 'material')
