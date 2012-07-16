L.LatLngBounds = L.Class.extend({
    initialize: function( southWest, northEast ) {

        // empty arguments, error
        if( !southWest ) { return; }

        // 1 or 2 args ?
        var latlngs = northEast ? [ southWest, northEast ] : southWest;

        for( var i= 0, len=latlngs.length; i<len; i++ ) {
            this.extend( latlngs[i] );
        }
    },


    // extend bounds to contain given point/bounds
    extend: function( obj ) {
        if( typeof obj[0] === 'number'
            || obj instanceof L.LatLng ) {

            obj = L.latLng( obj );

        } else {

            obj = L.latLngBounds( obj );
        }

        if( obj instanceof L.LatLng ) {
            if( !this._southWest && !this._northEast) {

                this._southWest = new L.LatLng( obj.lat, obj.lng, true );

                this._northEast = new L.LatLng( obj.lat, obj.lng, true );

            } else {

                // bottom left
                this._southWest.lat = Math.min( obj.lat, this._southWest.lat );
                this._southWest.lng = Math.min( obj.lng, this._southWest.lng );

                // top right
                this._northEast.lat = Math.max( obj.lat, this._northEast.lat );
                this._northEast.lng = Math.max( obj.lng, this._northEast.lng );
            }
        } else if( obj instanceof L.LatLngBounds ) {
            this.extend( obj._southWest );
            this.extend( obj._northEast );
        }
        return this;
    },

    // extend bounds by a percentage
    pad: function( bufferRatio ) {

        var sw = this._southWest,
            ne = this._northEast,

            // percentage of (y2 - y1)
            heightBuffer = Math.abs( sw.lat - ne.lat )
                           * bufferRatio,

            // percentage of( x2 - x1 )
            widthBuffer = Math.abs( sw.lng - ne.lng)
                          * bufferRatio;


        return new L.LatLngBounds(
            new L.LatLng( sw.lat - heightBuffer, sw.lng - widthBuffer ),
            new L.LatLng( ne.lat + heightBuffer, ne.lng + widthBuffer )
        );
    },

    getCenter: function() {
        return new L.LatLng(
            (this._southWest.lat + this._northEast.lat) / 2,   // (bottom+top)/2
            (this._southWest.lng + this._northEast.lng) / 2);  // (left+right)/2
    },

    getSouthWest: function() {
        return this._southWest;
    },

    getNorthEast: function() {
        return this._northEast;
    },

    getNorthWest: function() {
        return new L.LatLng( this._northEast.lat,
                             this._southWest.lng, true);
    },

    getSouthEast: function() {
        return new L.LatLng( this._southWest.lat,
                             this._northEast.lng, true );
    },

    /**
     *
     * @param {LatLngBounds | LatLng} obj
     */
    contains: function( obj ) {

        if( typeof obj[0] === 'number'
            || obj instanceof L.LatLng ) {

            obj = L.latLng(obj);

        } else {

            obj = L.latLngBounds(obj);
        }

        var sw = this._southWest,
            ne = this._northEast,
            sw2, ne2;

        if( obj instanceof L.LatLngBounds ) {
            sw2 = obj.getSouthWest();
            ne2 = obj.getNorthEast();
        } else {
            sw2 = ne2 = obj;
        }

        return (sw2.lat >= sw.lat)          // check bottom left
                && (sw2.lng >= sw.lng)

                && (ne2.lat <= ne.lat)      // check top right
                && (ne2.lng <= ne.lng);
    },

    /**
     *
     * @param {LatLngBounds} bounds
     */
    intersects: function( bounds ) {
        bounds = L.latLngBounds( bounds );

        var sw2 = bounds.getSouthWest(),
            ne2 = bounds.getNorthEast();

        var latIntersects = (ne2.lat >= this._southWest.lat)     // check lat
                            && (sw2.lat <= this._northEast.lat);

        var lngIntersects = (ne2.lng >= this._southWest.lng)     // check lng
                            && (sw2.lng <= this._northEast.lng);

        return latIntersects && lngIntersects;
    },

    toBBoxString: function() {
        return [this._southWest.lng, this._southWest.lat,
                this._northEast.lng, this._northEast.lat].join(',');
    },

    equals: function( bounds ) {
        if( !bounds) { return false; }
        bounds = L.latLngBounds(bounds);

        return this._southWest.equals(
                                      bounds.getSouthWest() )

               && this._northEast.equals(
                                         bounds.getNorthEast() );
    }
})

L.latLngBounds = function( a, b ) {
    if( !a
        || a instanceof L.LatLngBounds ) {
        return a;
    }
    return new L.LatLngBounds(a, b);
}