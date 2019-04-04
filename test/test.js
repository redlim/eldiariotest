const assert = require('assert');

const removeProperty = require('../ejercicio2');
const formatDate = require('../ejercicio3');
const reverseOrder = require('../ejercicio5');
const accessor = require('../ejercicio6');

describe('Javascript exercises test', () => {
    describe('exercise 2', () => {
        it('should return false when the value is not present', () =>{
            const data = {a:1, b:2, c:0};
            assert.equal(removeProperty(data,'d'),false);
            assert.equal(data.a,1);
            assert.equal(data.b,2)
            assert.equal(data.c,0)
        });
        it('should return false when the value is not present', () =>{
            const data = {a:1, b:2};
            assert.equal(removeProperty(data,'b'),true);
            assert.equal(data.a, 1);
            assert.notEqual(data.b,2)
        });
    });
    describe('exercise 3', () => {
        it('should return a correct value' , () => {
            assert.equal(formatDate('11/26/2014'), '20141126');
            assert.notEqual(formatDate('11/26/2014'), '201402611');
            assert.equal(formatDate('2/21/2016'), '20160221');
            assert.equal(formatDate('9/2/2001'), '20010902');
            assert.notEqual(formatDate('9/2/2001'), '200192');
        });
        it('should return a error value' , () => {
            assert.equal(formatDate('13/26/2014'),'Input date format not valid'); // No existe el mes 13
            assert.equal(formatDate('9/33/2014'),'Input date format not valid'); // No existe el día 33
        })
    });

    describe('exercise 5', () => {
        it('should return a correct value' , () => {
            assert.equal(reverseOrder(7573), 7753);
            assert.equal(reverseOrder(2756938), 9876532);
            assert.equal(reverseOrder(3040), 4300);
            assert.equal(reverseOrder(9876), 9876);

        });
        it('should return a error value', () => {
            assert.notEqual(reverseOrder(9821),1289);
            assert.equal(reverseOrder('patata'), null);
            assert.equal(reverseOrder(121.21), 22111); // caso especial que no he querido controlar por limpieza de
            // código pero con un redondeo o contemplando que no sea float bastaría
        })
    })
    describe('exercise 6', () => {
        it('should return a correct value' , () => {
            const obj = { p1: {
                    p2: 'value'
                }
            }
            const otherAccessor = accessor(obj, 'patata');
            assert.equal(otherAccessor('p1.p2'),'value');
            assert.equal(accessor(obj, 'pepperoni', 'p1.p2'), 'value')
        });
        it('should return a default value', () => {
            const obj = { p1: {
                    p2: 'value'
                }
            };
            const otherAccessor = accessor(obj, 'patata');
            assert.equal(otherAccessor('p1.p4'),'patata');
            assert.equal(accessor(obj, 'pepperoni', 'p1.p3'), 'pepperoni')
        })
        it('should return a deeper value', () => {
            const obj = {
                p1: {
                    p2: {
                        p3 : {
                            p4: {
                                p5: 'deeper'
                            }
                        }
                    }
                }
            };
            assert.equal(accessor(obj, 'lion', 'p1.p2.p3.p4.p5'), 'deeper');
            assert.equal(accessor(obj, 'lion', 'p1.p2.p3.p4.p5.p6'), 'lion')
        })
        it('should return a default value when not use dot', () => {
            const obj = {
                p1: {
                    p2: {
                        p3 : {
                            p4: {
                                p5: 'deeper'
                            }
                        }
                    }
                }
            };
            assert.equal(accessor(obj, 'lion', 'p1,p2,p3.p4.p5'), 'lion');
            assert.equal(accessor(obj, 'lion', 'p1.p2.p3.p4.p5,p6'), 'lion')
        })
    })
});