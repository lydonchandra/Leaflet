xdescribe('Projection.Mercator', function() {
    var p = L.Projection.Mercator;

    beforeEach( function() {

        function almostEqual(a, b, p) {
            return Math.abs(a-b) <= (p || 1.0E-9);
        };

        this.addMatchers({
            toAlmostEqual: function( expected, margin ) {
                var p1 = this.actual,
                    p2 = expected;

                return almostEqual(p1.x, p2.x, margin)
                       && almostEqual(p1.y, p2.y, margin);
            }
        });
    });

    describe('#project', function() {
        it('should do projection properly', function() {
            //edge cases

            var projected1 = p.project(new L.LatLng(0, 0));
            var point1 = new L.Point(0, 0);
            expect(projected1).toAlmostEqual(point1);
            debugger;
            var projected2 = p.project(new L.LatLng(90, 180));
            var point2 = new L.Point(-Math.PI, Math.PI);
            expect(projected2).toAlmostEqual(point2);
        })
    })
});