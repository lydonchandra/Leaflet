describe('LatLng', function() {
    describe('constructor', function() {
        it('should set lat & lng', function() {
            var a = new L.LatLng( 25, 74 );
            expect(a.lat).toEqual(25);
            expect(a.lng).toEqual(74);

            var a = new L.LatLng(-25, -74);
            expect(a.lat).toEqual(-25);
            expect(a.lng).toEqual(-74);
        });

        it('should clamp latitude to lie between -90 .. 90', function() {
            var a = new L.LatLng(150, 0).lat;
            expect(a).toEqual(90);

            var b = new L.LatLng(-230, 0).lat;
            expect(b).toEqual(-90);
        });

        it('should clamp longitude to lie between -180 .. 180', function() {
            var a = new L.LatLng(0, 190).lng;
            expect(a).toEqual(-170);

            var c = new L.LatLng(0, 380).lng;
            expect(c).toEqual(20);

            // -181, -180, -179
            var d0 = new L.LatLng(0, -181).lng;
            expect(d0).toEqual(179);
            var d1 = new L.LatLng(0, -180).lng;
            expect(d1).toEqual(-180);
            var d2 = new L.LatLng(0, -179).lng;
            expect(d2).toEqual(-179);

            var d = new L.LatLng(0, -190).lng;
            expect(d).toEqual(170);

            var e = new L.LatLng(0, -360).lng;
            expect(e).toEqual(0);

            var f = new L.LatLng(0, -380).lng;
            expect(f).toEqual(-20);

            var g = new L.LatLng(0, 90).lng;
            expect(g).toEqual(90);


            // 179, 180, 181
            var h0 = new L.LatLng(0, 179).lng;
            expect(h0).toEqual(179);
            var h = new L.LatLng(0, 180).lng;
            expect(h).toEqual(180);
            var h1 = new L.LatLng(0, 181).lng;
            expect(h1).toEqual(-179);

            // 359, 360, 361
            var j = new L.LatLng(0,359).lng;
            expect(j).toEqual(-1);
            var b = new L.LatLng(0, 360).lng;
            expect(b).toEqual(0);
            var i = new L.LatLng(0,361).lng;
            expect(i).toEqual(1);
        });
    });

    describe('#equals', function() {
        it('should return true if compared objects are equal within certain margin', function() {
            var a = new L.LatLng(10, 20);

            var b = new L.LatLng(10 + 1.0E-10,
                                 20 - 1.0E-10);
            expect(a.equals(b)).toBe(true);

            var c = new L.LatLng(10 + 0.9E-9,
                                 20 + 0.9E-9);
            expect(a.equals(c)).toBe(true);

            var e = new L.LatLng(10,
                                 20 - 1.0E-9);
            expect(a.equals(e)).toBe(true);

            // due to rounding error, margin 10.0 - 9.999999999 is > 1.0E-9 is
            var d = new L.LatLng(10.0 - 1.0E-9,
                                 20.0 - 1.0E-9);
            expect(a.equals(d)).toBe(true);

            var f = new L.LatLng(1 - 1.0E-9,
                                 1 - 1.0E-9);
            var f1 = new L.LatLng(1, 1);
            expect(f.equals(f1)).toBe(true);

            var g = new L.LatLng(20, 10);
            var g1 = new L.LatLng(20 - 1.0E-9,
                                  10 - 1.0E-9);
            expect(g.equals(g1)).toBe(true);
        });

        it('should return false if compared objects are not equal within certain margin', function() {
            var a = new L.LatLng(10, 20);

            var b = new L.LatLng(10 + 2.0E-9,
                                 20 + 2.0E-9 );
            expect(a.equals(b)).toBe(false);


        })
    });
});

