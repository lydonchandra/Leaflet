describe('LatLngBounds', function(){
    describe('', function() {
        it('should contain bound2', function() {
            var bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                                             new L.LatLng(90,90) );

            var bound2 = new L.LatLngBounds( new L.LatLng(1,1),
                                             new L.LatLng(89,89) );

            expect( bound1.contains(bound2)).toBe(true);



            bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                                         new L.LatLng(90,90));

            bound2 = new L.LatLngBounds( new L.LatLng(0,0),
                                         new L.LatLng(90,90));

            expect( bound1.contains(bound2)).toBe(true);
            expect( bound2.contains(bound1)).toBe(true);


            bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                                         new L.LatLng(90,90));

            bound2 = new L.LatLngBounds( new L.LatLng(0,0),
                                         new L.LatLng(91,91))

            expect( bound1.contains(bound2)).toBe(false);
            expect( bound2.contains(bound1)).toBe(true);



        });
    })
});