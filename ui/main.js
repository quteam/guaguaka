/**
 * Created by hao on 15/7/2.
 */

//弹窗
function openDialog(_text) {
    $("#dialog .text").text(_text);
    $("#dialog").show();
}

$(".openDialog").on("click", function () {
    openDialog();
});


//刮刮卡
(function () {
    var img = new Image();
    var canvas = document.querySelector('#scratcher');
    var radio = $(".scratcher-wrap").width() / 584;
    var prizeText = "";

    img.addEventListener('load', function (e) {
        var ctx;
        var w = 584,
            h = 236;
        var offsetX = canvas.offsetLeft,
            offsetY = canvas.offsetTop;
        var mousedown = false;

        function layer(ctx) {
            var pat = ctx.createPattern(img, "repeat");
            ctx.fillStyle = pat;
            ctx.fillRect(0, 0, w, h);
        }

        function eventDown(e) {
            e.preventDefault();
            mousedown = true;
        }

        function eventUp(e) {
            e.preventDefault();
            mousedown = false;

            var data = ctx.getImageData(0, 0, w, h).data;
            for (var i = 0, j = 0; i < data.length; i += 4) {
                if (data[i] && data[i + 1] && data[i + 2] && data[i + 3]) {
                    j++;
                }
            }
            if (j <= w * h * 0.8) {
                openDialog(prizeText);
            }
        }

        function eventMove(e) {
            e.preventDefault();
            if (mousedown) {
                if (e.changedTouches) {
                    e = e.changedTouches[e.changedTouches.length - 1];
                }
                var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
                    y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;
                with (ctx) {
                    beginPath()
                    arc(x / radio, y / radio, 40, 0, Math.PI * 2);
                    fill();
                }
            }
        }

        canvas.width = w;
        canvas.height = h;
        ctx = canvas.getContext('2d');
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, w, h);
        layer(ctx);

        ctx.globalCompositeOperation = 'destination-out';

        canvas.addEventListener('touchstart', eventDown);
        canvas.addEventListener('touchend', eventUp);
        canvas.addEventListener('touchmove', eventMove);
        canvas.addEventListener('mousedown', eventDown);
        canvas.addEventListener('mouseup', eventUp);
        canvas.addEventListener('mousemove', eventMove);
    });
    img.src = canvas.dataset.src;

    $("#scratcher").one("touchmove", function () {
        $.getJSON(getPrizeUrl, function (data) {
            if (data.status == 200) {
                switch (data.prize) {
                    case 1:
                        prizeText = '你刮中了一等奖，赶快去领取吧';
                        $(canvas).addClass("prize-1");
                        break;
                    case 2:
                        prizeText = '你刮中了二等奖，赶快去领取吧';
                        $(canvas).addClass("prize-2");
                        break;
                    case 3:
                        prizeText = '你刮中了三等奖，赶快去领取吧';
                        $(canvas).addClass("prize-3");
                        break;
                    case 4:
                        prizeText = '你刮中了四等奖，赶快去领取吧';
                        $(canvas).addClass("prize-4");
                        break;
                }
            }
        })
    })
})();


//滚动
$(function () {
    var $this = $("#list-2");
    var scrollTimer;

    scrollTimer = setInterval(function () {
        scrollNews($this);
    }, 2000);


    function scrollNews(obj) {
        var $self = obj.find("ul");
        var lineHeight = $self.find("li:first").height() + 5;
        $self.animate({
            "marginTop": -lineHeight + "px"
        }, 600, function () {
            $self.css({
                marginTop: 0
            }).find("li:first").appendTo($self);
        })
    }
});