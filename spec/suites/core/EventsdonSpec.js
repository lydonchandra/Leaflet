describe('Events', function() {

    var Klass;

    beforeEach( function() {
        Klass = L.Class.extend( {
            includes:L.Mixin.Events
        });
    });

    describe('#fireEvent', function() {
        it('should fire all listeners added through #addEventListener', function() {
            var obj = new Klass(),
                spy = jasmine.createSpy(),
                spy2 = jasmine.createSpy(),
                spy3 = jasmine.createSpy(),
                spy4 = jasmine.createSpy(),
                spy5 = jasmine.createSpy(),
                spy6 = jasmine.createSpy();

            obj.addEventListener('test', spy);
            obj.addEventListener('test', spy2);
            obj.addEventListener('other', spy3);
            obj.addEventListener( {test:spy4, other: spy5} );
            obj.addEventListener( {'test other' : spy6 });


            expect(spy).not.toHaveBeenCalled();
            expect(spy2).not.toHaveBeenCalled();
            expect(spy3).not.toHaveBeenCalled();
            expect(spy4).not.toHaveBeenCalled();
            expect(spy5).not.toHaveBeenCalled();
            expect(spy6).not.toHaveBeenCalled();

            obj.fireEvent('test');

            expect(spy).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
            expect(spy3).not.toHaveBeenCalled();
            expect(spy4).toHaveBeenCalled();
            expect(spy5).not.toHaveBeenCalled();
            expect(spy6).toHaveBeenCalled();
            expect(spy6.calls.length).toEqual(1);
        });

        it('should provide event object to listeners and execute them in right context', function() {
            var obj = new Klass(),
                obj2 = new Klass(),
                obj3 = new Klass(),
                obj4 = new Klass(),
                foo = {};

            function listener1(e) {
                expect(e.type).toEqual('test');
                expect(e.target).toEqual(obj);
                expect(this).toEqual(obj);
                expect(e.baz).toEqual(1);
            }
            obj.addEventListener('test', listener1);
            obj.fireEvent('test', { baz: 1 } );

            function listener2(e) {
                expect(e.type).toEqual('test');
                expect(e.target).toEqual(obj2);
                expect(this).toEqual(foo);
                expect(e.baz).toEqual(2);
            }
            obj2.addEventListener('test', listener2, foo);
            obj2.fireEvent('test', { baz:2 } );

            function listener3(e) {
                expect(e.type).toEqual('test');
                expect(e.target).toEqual(obj3);
                expect(this).toEqual(obj3);
                expect(e.baz).toEqual(3);
            }
            obj3.addEventListener( {test: listener3} );
            obj3.fireEvent('test', {baz:3} );


            function listener4(e) {
                expect(e.type).toEqual('test');
                expect(e.target).toEqual(obj4);
                expect(this).toEqual(foo);
                expect(e.baz).toEqual(4);
            }
            obj4.addEventListener( {test: listener4}, foo);
            obj4.fireEvent('test', {baz:4} );
        });

        it('should not call listeners removed through #removeEventListener', function() {
            var obj = new Klass(),
                spy = jasmine.createSpy(),
                spy2 = jasmine.createSpy(),
                spy3 = jasmine.createSpy(),
                spy4 = jasmine.createSpy(),
                spy5 = jasmine.createSpy();

            obj.addEventListener('test', spy);
            obj.removeEventListener('test', spy);

            obj.fireEvent('test');

            expect(spy).not.toHaveBeenCalled();

            obj.addEventListener('test2', spy2);
            obj.addEventListener('test2', spy3);
            obj.removeEventListener('test2');

            obj.fireEvent('test2');

            expect(spy2).not.toHaveBeenCalled();
            expect(spy3).not.toHaveBeenCalled();

            obj.addEventListener('test3', spy4);
            obj.addEventListener('test4', spy5);
            obj.removeEventListener( {
                test3: spy4,
                test4: spy5
            });

            obj.fireEvent('test3');
            obj.fireEvent('test4');

            expect(spy4).not.toHaveBeenCalled();
            expect(spy5).not.toHaveBeenCalled();
        });
    });

    describe('#on, #off & #fire', function() {

        it('should work like #addEventListener && #removeEventListener', function() {
            var obj = new Klass(),
                spy = jasmine.createSpy();

            obj.on('test', spy);
            obj.fire('test');

            expect(spy).toHaveBeenCalled();

            obj.off('test', spy);
            obj.fireEvent('test');

            expect(spy.callCount).toBeLessThan(2);
        });

        it('should not override existing methods with same name', function() {
            var spy1 = jasmine.createSpy(),
                spy2 = jasmine.createSpy(),
                spy3 = jasmine.createSpy();

            var Klass2 = L.Class.extend( {
                includes: L.Mixin.Events,
                on: spy1,
                off: spy2,
                fire: spy3
            });

            var obj = new Klass2();
            obj.on();
            expect(spy1).toHaveBeenCalled();

            obj.off();
            expect(spy2).toHaveBeenCalled();

            obj.fire();
            expect(spy3).toHaveBeenCalled();
        });
    });

    describe('add multiple events in 1 string #addEventListener', function() {

        it('should add 2 events, event1 & event2', function() {

            var spy1 = jasmine.createSpy();

            var obj = new Klass();

            obj.addEventListener('event1 event2', spy1);

            expect(spy1).not.toHaveBeenCalled();

            obj.fireEvent('event1', {} );
            expect(spy1).toHaveBeenCalled();

            obj.fireEvent('event2', {} );
            expect(spy1.callCount).toBe(2);

            obj.removeEventListener('event1' );
            obj.fireEvent('event1', {} );
            // callCount must not change
            expect(spy1.callCount).toBe(2);

            // event2 should exists, trigger it
            obj.fireEvent('event2', {} );
            expect(spy1.callCount).toBe(3);

            // event2 shouldn't exist, spy1 shouldn't execute
            obj.removeEventListener('event2');
            expect(spy1.callCount).toBe(3);
        });


        it('should remove >= 2 events', function() {
            var spy1 = jasmine.createSpy();
            var obj = new Klass();

            obj.addEventListener('event1 event2', spy1);
            expect(spy1).not.toHaveBeenCalled();

            obj.removeEventListener('event1 event2');
            obj.fireEvent('event1');
            obj.fireEvent('event2');
            expect(spy1).not.toHaveBeenCalled();
        });

        it('shouldnt fire multiple events in one go', function() {
            var spy1 = jasmine.createSpy();
            var obj = new Klass();

            obj.addEventListener('event1 event2', spy1);
            obj.fireEvent('event1 event2');
            expect(spy1).not.toHaveBeenCalled();
        });
    });


});
