(function($) {

    // initialize variables
    var score;
    var outcome;
    var qualifications;
    var eliminations;
    var multiplier = 1;

    // reset score sheet
    function resetScoreSheet() {

        // setup score structure
        score = {
            auto: {
                crossed_baseline : 0,
                high_goal: 0,
                low_goal: 0,
                rotors: 0
            },
            tele: {
                high_goal: 0,
                low_goal: 0,
                rotors: 0,
                climbed_rope : 0
            }
        };

        // set initial vars
        outcome = 'loss';
        qualifications = true;
        eliminations = false;

        // reset html elements
        $('#qualifications').addClass('btn-success').removeClass('btn-outline-success');
        $('#eliminations').addClass('btn-outline-success').removeClass('btn-success');
        $('input').val(0);
        $('#win').addClass('btn-outline-success').removeClass('btn-success');
        $('#tie').addClass('btn-outline-success').removeClass('btn-success');
        $('#loss').addClass('btn-danger').removeClass('btn-outline-danger');

        // scroll to top if not already there
        $('body').scrollTop(0);
    }

    // calculate points
    function calculatePts() {
        return Math.floor((score.auto.crossed_baseline * 5) + score.auto.high_goal + (score.auto.low_goal / 3) + (score.auto.rotors * 60) + (score.tele.high_goal / 3) + (score.tele.low_goal / 9) + (score.tele.rotors * 40) + (score.tele.climbed_rope * 50));
    }

    // calculate kpa
    function calculateKpa() {
        return Math.floor(((score.auto.low_goal / 3) + score.auto.high_goal + (score.tele.low_goal / 9) + (score.tele.high_goal / 3)));
    }

    // calculate rank points
    function calculateRp() {
        var rp = 0;
        if (outcome == 'win') {
            rp += 2;
        }
        if (outcome == 'tie') {
            rp += 1;
        }
        if (calculateKpa() > 39) {
            rp += 1;
        }
        if (score.tele.rotors == 4) {
            rp += 1;
        }
        return rp;
    }

    function calculateSeconds() {
        if (score.auto.high_goal > score.auto.low_goal) {
            var auto_seconds = Math.ceil(score.auto.high_goal / 5);
        } else {
            var auto_seconds = Math.ceil(score.auto.low_goal / 5);
        }
        $('#auto-seconds').html('~' + auto_seconds + ' sec');
        if (auto_seconds > 15) {
            $('#auto-seconds').addClass('overlimit');
        } else {
            $('#auto-seconds').removeClass('overlimit');
        }
        if (score.tele.high_goal > score.tele.low_goal) {
            var tele_seconds = Math.ceil(score.tele.high_goal / 5);
        } else {
            var tele_seconds = Math.ceil(score.tele.low_goal / 5);
        }
        $('#tele-seconds').html('~' + tele_seconds + ' sec');
        if (tele_seconds > 135) {
            $('#tele-seconds').addClass('overlimit');
        } else {
            $('#tele-seconds').removeClass('overlimit');
        }
    }

    // display the score
    function displayScore() {

        var pts = calculatePts();
        var kpa = calculateKpa();
        var rp = calculateRp();

        calculateSeconds();

        var bonus = 0;

        // additional calculations during playoffs
        if (eliminations) {
            if (kpa > 39) {
                bonus += 20;
            }
            if (score.tele.rotors == 4) {
                bonus += 100;
            }
        }

        // add bonus points
        pts += bonus;

        // human readable format
        if (qualifications) {
            $('#score').html(pts + ' pts, ' + kpa + ' kPa, ' + rp + ' rp');
        } else {
            $('#score').html(pts + ' pts, ' + kpa + ' kPa ');
        }
    }

    // when in landscape using an iPhone show field map
    function monitorWindowSize() {
        $(window).resize(function(){
            var height = $(window).height();
            var width = $(window).width();
            var gamemap = $('#game-map').height();
            var margin = ((height - gamemap) / 2);
            if (width > height) {
                $('.portrait').addClass('hidden');
                $('.landscape').removeClass('hidden');
                $('#game-map').css('margin-top', margin);
            } else {
                $('.landscape').addClass('hidden');
                $('.portrait').removeClass('hidden');
            }
        });
    }

    // when a button is clicked...
    $('button').click(function(e) {

        var id = $(this).attr('id');

        switch (id) {

            case 'open-score-sheet':
            $('#page-title').removeClass('hidden');
            $('#score').removeClass('hidden');
            $('#first-steamworks').addClass('hidden');
            $('.content').removeClass('hidden');
            if ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("Android") != -1) || (navigator.platform.indexOf("Linux") != -1) ) {
                monitorWindowSize();
            }
            break;

            case 'qualifications':
            qualifications = true;
            eliminations = false;
            $(this).addClass('btn-success').removeClass('btn-outline-success');
            $('#eliminations').addClass('btn-outline-success').removeClass('btn-success');
            break;

            case 'eliminations':
            qualifications = false;
            eliminations = true;
            $(this).addClass('btn-success').removeClass('btn-outline-success');
            $('#qualifications').addClass('btn-outline-success').removeClass('btn-success');
            break;

            case 'reset':
            resetScoreSheet();
            break;

            case 'auto-crossed-baseline-plus':
            if (score.auto.crossed_baseline < 3) {
                score.auto.crossed_baseline += 1;
                $('#auto-crossed-baseline-counter').val(score.auto.crossed_baseline);
            }
            break;

            case 'auto-crossed-baseline-minus':
            if (score.auto.crossed_baseline > 0) {
                score.auto.crossed_baseline -= 1;
                $('#auto-crossed-baseline-counter').val(score.auto.crossed_baseline);
            }
            break;

            case 'auto-high-goal-plus':
            score.auto.high_goal += multiplier;
            $('#auto-high-goal-counter').val(score.auto.high_goal);
            break;

            case 'auto-high-goal-minus':
            score.auto.high_goal -= multiplier;
            if (score.auto.high_goal < 0) {
                score.auto.high_goal = 0;
            }
            $('#auto-high-goal-counter').val(score.auto.high_goal);
            break;

            case 'auto-low-goal-plus':
            score.auto.low_goal += multiplier;
            $('#auto-low-goal-counter').val(score.auto.low_goal);
            break;

            case 'auto-low-goal-minus':
            score.auto.low_goal -= multiplier;
            if (score.auto.low_goal < 0) {
                score.auto.low_goal = 0;
            }
            $('#auto-low-goal-counter').val(score.auto.low_goal);
            break;

            case 'auto-rotors-plus':
            if (score.auto.rotors < 2) {
                score.auto.rotors += 1;
                $('#auto-rotors-counter').val(score.auto.rotors);
            }
            break;

            case 'auto-rotors-minus':
            if (score.auto.rotors > 0) {
                score.auto.rotors -= 1;
                $('#auto-rotors-counter').val(score.auto.rotors);
            }
            break;

            case 'tele-high-goal-plus':
            score.tele.high_goal += multiplier;
            $('#tele-high-goal-counter').val(score.tele.high_goal);
            break;

            case 'tele-high-goal-minus':
            score.tele.high_goal -= multiplier;
            if (score.tele.high_goal < 0) {
                score.tele.high_goal = 0;
            }
            $('#tele-high-goal-counter').val(score.tele.high_goal);
            break;

            case 'tele-low-goal-plus':
            score.tele.low_goal += multiplier;
            $('#tele-low-goal-counter').val(score.tele.low_goal);
            break;

            case 'tele-low-goal-minus':
            score.tele.low_goal -= multiplier;
            if (score.tele.low_goal < 0) {
                score.tele.low_goal = 0;
            }
            $('#tele-low-goal-counter').val(score.tele.low_goal);
            break;

            case 'tele-rotors-plus':
            if (score.tele.rotors < 4) {
                score.tele.rotors += 1;
                $('#tele-rotors-counter').val(score.tele.rotors);
            }
            break;

            case 'tele-rotors-minus':
            if (score.tele.rotors > 0) {
                score.tele.rotors -= 1;
                $('#tele-rotors-counter').val(score.tele.rotors);
            }
            break;

            case 'tele-climbed-rope-plus':
            if (score.tele.climbed_rope < 3) {
                score.tele.climbed_rope += 1;
                $('#tele-climbed-rope-counter').val(score.tele.climbed_rope);
            }
            break;

            case 'tele-climbed-rope-minus':
            if (score.tele.climbed_rope > 0) {
                score.tele.climbed_rope -= 1;
                $('#tele-climbed-rope-counter').val(score.tele.climbed_rope);
            }
            break;

            case 'win':
            outcome = 'win';
            $(this).addClass('btn-success').removeClass('btn-outline-success');
            $('#tie').addClass('btn-outline-success').removeClass('btn-success');
            $('#loss').addClass('btn-outline-danger').removeClass('btn-danger');
            swal({
              title: "You Won!",
              text: "Two ranking points granted.",
              type: "success",
              timer: 3000,
              showConfirmButton: true
            });
            break;

            case 'tie':
            outcome = 'tie';
            $('#win').addClass('btn-outline-success').removeClass('btn-success');
            $(this).addClass('btn-success').removeClass('btn-outline-success');
            $('#loss').addClass('btn-outline-danger').removeClass('btn-danger');
            swal({
              title: "You Tied!",
              text: "One ranking point granted.",
              type: "success",
              timer: 3000,
              showConfirmButton: true
            });
            break;

            case 'loss':
            outcome = 'loss';
            $('#win').addClass('btn-outline-success').removeClass('btn-success');
            $('#tie').addClass('btn-outline-success').removeClass('btn-success');
            $(this).addClass('btn-danger').removeClass('btn-outline-danger');
            swal({
              title: "You Lost!",
              text: "Zero additional ranking points.",
              type: "error",
              timer: 3000,
              showConfirmButton: true
            });
            break;

            case 'foul':
            swal({
              title: "Foul!",
              text: "+5pts credited to opponent.",
              type: "warning",
              timer: 3000,
              showConfirmButton: true
            });
            break;

            case 'tech':
            swal({
              title: "Technical Foul!",
              text: "+25pts credited to opponent.",
              type: "warning",
              timer: 3000,
              showConfirmButton: true
            });
            break;

            // the only buttons without ids are the multipliers
            default:
            multiplier = Number($(this).attr('rel'));
            $('.multiplier').removeClass('btn-primary').addClass('btn-outline-primary');
            $(this).removeClass('btn-outline-primary').addClass('btn-primary');
            if (multiplier == 1) {
                $('.up').html("+").removeClass('fives tens');
                $('.down').html("-").removeClass('fives tens');
            }
            if (multiplier == 5) {
                $('.multiplier-tag').html("<small>5</small>").addClass('fives').removeClass('tens');
            }
            if (multiplier == 10) {
                $('.multiplier-tag').html("<small>10</small>").addClass('tens').removeClass('fives');
            }

            break;
        }

        displayScore();
    });

    // disable direct input
    $('input').prop("disabled", true);

    // call fastclick for use in mobile browsers
    FastClick.attach(document.body);

    // initial setup then display the score
    resetScoreSheet();
    displayScore();

})(jQuery);
