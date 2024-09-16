import Convertor from "./convertor.js"
import NumberConvertor from "./number.js"

import RegexpUtil from "../utility/regexp_util.js"

import Angle from "../geometry/angle.js"

export default class AngleConvertor extends Convertor
{
    static getName = () => {
        return 'angle'
    }

    static accepts = (object) => {
        return (object instanceof Angle)
    }

    static getAllAvailableUnits = () => {
        return ['deg', 'rad', 'grad', 'turn']
    }

    static parse = (string, params, fnName) => {
        var space = new RegexpUtil(params.get('angle.input.space'))
        var caseSensitive = params.get('angle.input.unitsCaseSensitive')
        var units = params.get('angle.units')
        var availableUnits = this.getAllAvailableUnits()
        var unitFound = null
        var unitVariantFound = null
        var newString

        string = space.trim(string)

        for (var i = 0; i < availableUnits.length; i++) {
            if (availableUnits[i] in units) {
                var unitVariants = units[availableUnits[i]]
                for (var j = 0; j < unitVariants.length; j++) {
                    var s = this.findUnit(string, unitVariants[j], caseSensitive)
                    if (s !== null) {
                        if (unitVariantFound === null || unitVariants[j].length > unitVariantFound.length) {
                            unitFound = availableUnits[i]
                            unitVariantFound = unitVariants[j]
                            newString = s
                        }
                    }
                }
            }
        }


        if (unitFound !== null) {
            string = space.trim(newString)
        } else {
            unitFound = params.get('angle.defaultUnit')
            var unitExists = false
            for (var i = 0; i < availableUnits.length; i++) {
                if (availableUnits[i] === unitFound) {
                    unitExists = true
                    break
                }
            }

            if (!unitExists) {
                unitFound = availableUnits[0]
            }
        }

        var number = params.invokeParse(NumberConvertor, string)

        return Angle[unitFound].call(Angle, number)
    }

    static findUnit = (string, unit, caseSensitive) => {
        if (string.length < unit.length) {
            return null
        }

        var parsedUnit = string.substr(string.length - unit.length, unit.length)
        
        if (!caseSensitive) {
            unit = unit.toLowerCase()
            parsedUnit = parsedUnit.toLowerCase()
        }

        if (unit !== parsedUnit) {
            return null
        }

        return string.substr(0, string.length - unit.length)
    }

    static toString = (angle, params, fnName) => {
        var angleUnit = this.getRealUnit(params.get('angle.output.unit'), false)
        var angleDefaultUnit = this.getRealUnit(params.get('angle.defaultUnit'), true)
        var number = null

        var availableUnits = this.getAllAvailableUnits()
        for (var i = 0; i < availableUnits.length; i++) {
            if (angleUnit === availableUnits[i]) {
                number = angle[angleUnit].call(angle)
            }
        }
        if (number === null) {
            number = angle.deg()
        }

        var string = params.invokeToString(NumberConvertor, number)

        if (params.get('angle.output.showDefaultUnit') || angleUnit !== angleDefaultUnit) {
            string += params.get('angle.output.unitSeparator')
            string += this.getAngleOutputUnit(angleUnit, params)
        }

        return string
    }

    static getAngleOutputUnit = (unit, params) => {
        var units = params.get('angle.units')
        if (unit in units) {
            return units[unit][0]
        }

        return unit
    }

    static getRealUnit = (u, allowEmpty) => {
        var availableUnits = this.getAllAvailableUnits()
        var found = false
        for (var i = 0; i < availableUnits.length; i++) {
            if (u === availableUnits[i]) {
                found = true
                break
            }
        }
        if (!found) {
            u = null
        }

        if (!allowEmpty && u === null) {
            u = availableUnits[0]
        }

        return u
    }
}
