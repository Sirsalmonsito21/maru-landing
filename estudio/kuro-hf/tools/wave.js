        function waveCrash(t) {
          // Ola viva: sube detrás, rompe con cresta y espuma, arrastra a Kuro y se retira. Solo cubre la mitad baja.
          var H = 150 * outQ(pk(t, 8.4, .4)) * (1 - outQ(pk(t, 9.28, .42)));
          var front = lerp(330, -140, Math.pow(pk(t, 8.72, .62), 1.15));
          var base = 350 + 60 * pk(t, 9.28, .42);
          if (H < 1) return null;
          var top = function (x) {
            var d = x - front;
            if (d < -6) return 9999;
            var prof = d < 26 ? Math.sqrt(Math.max(0, d + 6) / 32) : 1 - Math.min(.55, (d - 26) / 520);
            return base - H * prof + Math.sin(x * .09 + t * 7) * 3 + Math.sin(x * .23 - t * 11) * 1.5;
          };
          for (var x = 0; x < PW; x++) {
            var ty = top(x); if (ty > PH) continue;
            for (var y = Math.floor(ty); y < PH; y++) {
              var dep = y - ty, c;
              if (dep < 3) c = "#f4fbff";
              else if (dep < 7) c = ((x + y) & 3) ? "#bdf1f2" : "#f4fbff";
              else if (dep < 18) c = "#6fd3dc";
              else if (dep < 40) c = ((x * 3 + y) % 11 === 0) ? "#8fe3ea" : "#2fb3c7";
              else if (dep < 80) c = ((x + y * 2) % 13 === 0) ? "#3fb7c9" : "#1f7f9c";
              else c = ((x + y) % 17 === 0) ? "#2a8fb0" : "#175a7e";
              if (dep > 8 && dep < 30 && ((x + Math.floor(t * 30)) % 23) < 2) c = "#ffc59a";
              px(x, y, c);
            }
          }
          // labio de la cresta que se curva hacia adelante
          var cx0 = front + 4, cy0 = base - H - 4;
          for (var i = 0; i < 26; i++) { var a = Math.PI * (1.05 + i / 26 * .9), r = 16 + (i % 3); var lx = cx0 + Math.cos(a) * r * .9 + 14, ly = cy0 + Math.sin(a) * r * .7 + 10; rect(lx, ly, 3, 3, i % 4 ? "#f4fbff" : "#bdf1f2"); }
          // spray
          for (var s = 0; s < 46; s++) {
            var k = (t * 1.6 + hash(s)) % 1, sx = front + (hash(s + 3) - .2) * 80, sy = base - H - k * 70 * hash(s + 7) + k * k * 60;
            if (sx > 0 && sx < PW) rect(sx, sy, 2, 2, s % 3 ? "#f4fbff" : "#8fe3ea");
          }
          return { top: top, front: front, H: H, base: base };
        }
