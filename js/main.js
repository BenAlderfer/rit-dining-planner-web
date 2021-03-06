"use strict";

//global variables
let planName;
let initial;
let rollover;
let remaining;
let dayDiff;
let totalDaysOff;
let pastDaysOff;
let startDate;
let endDate;
let start, end, today;
let dialog;

const ENTER_KEY = 13;

//snackbar variables
let notification;
let data;

//runs startup commands after page loads
function startUp() {
    notification = $(".mdl-js-snackbar");

    //restore saved fields
    restoreFields();

    //show or hide custom dining field as needed
    planSelected();

    //if they have a saved plan, they should have everything else to calculate
    if (planName != "") {
        //calculate numbers and set fields
        calculateAndSet();
    }
}

//clears the local storage on option selected
//used to reset to defaults
//ex - getting new default dates for next semester
function clearLocalStorage() {
    localStorage.clear();
    setVarDefaults();
    blankFields();
    hideResults();
    setFields();
}

//sets the default values for variables
function setVarDefaults() {
    planName = "";
    initial = 0;
    rollover = 0;
    remaining = 0;
    dayDiff = 0;
    totalDaysOff = 9;
    pastDaysOff = 0;
    startDate = "08/26/2019";
    endDate = "12/18/2019";
}

//clears out fields
function blankFields() {
    const customDining = $("#custom-dining");
    const rollOver = $("#rollover");
    const remaining = $("#remaining");
    const startDate = $("#start-date");
    const endDate = $("#end-date");
    const totalDaysOff = $("#total-days-off");
    const pastDaysOff = $("#past-days-off");

    //blank fields
    customDining.val("");
    rollOver.val("");
    remaining.val("");
    startDate.val("");
    endDate.val("");
    totalDaysOff.val("");
    pastDaysOff.val("");

    //drop floating labels and error messages
    customDining.parent().removeClass("is-dirty");
    customDining.parent().removeClass("is-invalid");

    rollOver.parent().removeClass("is-dirty");
    rollOver.parent().removeClass("is-invalid");

    remaining.parent().removeClass("is-dirty");
    remaining.parent().removeClass("is-invalid");

    startDate.parent().removeClass("is-dirty");
    startDate.parent().removeClass("is-invalid");

    endDate.parent().removeClass("is-dirty");
    endDate.parent().removeClass("is-invalid");

    totalDaysOff.parent().removeClass("is-dirty");
    totalDaysOff.parent().removeClass("is-invalid");

    pastDaysOff.parent().removeClass("is-dirty");
    pastDaysOff.parent().removeClass("is-invalid");
}

//saves input
function saveFields() {
    localStorage.setItem("planName", planName);
    localStorage.setItem("initial", initial);
    localStorage.setItem("rollover", rollover);
    localStorage.setItem("remaining", remaining);
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);
    localStorage.setItem("dayDiff", dayDiff);
    localStorage.setItem("totalDaysOff", totalDaysOff);
    localStorage.setItem("pastDaysOff", pastDaysOff);
}

//restores saved input
function restoreFields() {
    //read saved values if not null
    if (localStorage.getItem("planName") != null) {
        planName = localStorage.getItem("planName");
    }

    if (localStorage.getItem("initial") != null) {
        initial = localStorage.getItem("initial");
    }

    if (localStorage.getItem("rollover") != null) {
        rollover = localStorage.getItem("rollover");
    }

    if (localStorage.getItem("remaining") != null) {
        remaining = localStorage.getItem("remaining");
    }

    if (localStorage.getItem("startDate") != null) {
        startDate = localStorage.getItem("startDate");
    }

    if (localStorage.getItem("endDate") != null) {
        endDate = localStorage.getItem("endDate");
    }

    if (localStorage.getItem("dayDiff") != null) {
        dayDiff = localStorage.getItem("dayDiff");
    }

    if (localStorage.getItem("totalDaysOff") != null) {
        totalDaysOff = localStorage.getItem("totalDaysOff");
    }

    if (localStorage.getItem("pastDaysOff") != null) {
        pastDaysOff = localStorage.getItem("pastDaysOff");
    }

    setFields();
}

//set fields, need to set class "is-dirty" to make labels float
//if custom, show custom field and fill it in
function setFields() {
    if (planName == "custom") {
        $("#plan").val(planName);
        planSelected();
        $("#custom-dining").val(String(initial - rollover));
        $("#custom-dining").parent().addClass("is-dirty");
    } else { //otherwise, set plan normally
        $("#plan").val(planName);
        planSelected();
    }

    //only fill in if something was saved
    if (rollover != 0) {
        $("#rollover").val(String(rollover));
        $("#rollover").parent().addClass("is-dirty");
    }

    if (remaining != 0) {
        $("#remaining").val(String(remaining));
        $("#remaining").parent().addClass("is-dirty");
    }

    $("#start-date").val(String(startDate));
    $("#start-date").parent().addClass("is-dirty");

    $("#end-date").val(String(endDate));
    $("#end-date").parent().addClass("is-dirty");

    if (totalDaysOff != 0) {
        $("#total-days-off").val(String(totalDaysOff));
        $("#total-days-off").parent().addClass("is-dirty");
    }

    if (pastDaysOff != 0) {
        $("#past-days-off").val(String(pastDaysOff));
        $("#past-days-off").parent().addClass("is-dirty");
    }
}

//hides the results cards
function hideResults() {
    $("#summary-card").css("display", "none");
    $("#table-card").css("display", "none");
}

//shows the results cards
function showResults() {
    $("#summary-card").css("display", "block");
    $("#table-card").css("display", "block");
}

//if custom plan selected, show custom input line
function planSelected() {
    //hide or show custom dining input
    if ($("#plan").val() == "custom") {
        $("#custom-dining-form").css("display", "block");
    } else {
        $("#custom-dining-form").css("display", "none");
    }
}

//get the initial dining from dropdown menu
function getInitial() {
    planName = $("#plan").val();
    switch (planName) {
        case "5":
            return 1350.0;
        case "10":
            return 750.0;
        case "14":
            return 550.0;
        case "20":
            return 350.0;
        case "orange":
            return 2950.0;
        case "brown":
            return 2200.0;
        case "gold":
            return 1600.0;
        case "silver":
            return 1100.0;
        case "bronze":
            return 500.0;
        default: //custom
            return Number($("#custom-dining").val());
    }
}

//checks if the initial value is valid
//only show error message if true passed
function initialIsValid(willShowErrorMessage) {
    if (planName == "") {
        if (willShowErrorMessage) {
            data = {
                message: "The dining plan must be selected.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    if (initial <= 0 || !/^\d{1,4}(?:[.]\d{1,2}|$)$/.test(String(initial))) {
        if (willShowErrorMessage) {
            data = {
                message: "The initial dining must be a positive number.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    if (initial > 9999.99) {
        if (willShowErrorMessage) {
            data = {
                message: "The initial cannot exceed 9999.99.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    return true;
}

//checks if the rollover value is valid
//only show error message if true passed
function rolloverIsValid(willShowErrorMessage) {
    if (rollover != "" && (rollover < 0 || !/^\d{1,4}(?:[.]\d{1,2}|$)$/.test(String(rollover)))) {
        if (willShowErrorMessage) {
            data = {
                message: "The rollover must be a positive number.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    if (rollover > 9999.99) {
        if (willShowErrorMessage) {
            data = {
                message: "The rollover cannot exceed 9999.99.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    return true;
}

//checks if the remaining value is valid
//only show error message if true passed
function remainingIsValid(willShowErrorMessage) {
    if (remaining <= 0 || !/^\d{1,4}(?:[.]\d{1,2}|$)$/.test(String(remaining))) {
        if (willShowErrorMessage) {
            data = {
                message: "The remaining must be a positive number.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    if (remaining > 9999.99) {
        if (willShowErrorMessage) {
            data = {
                message: "The remaining cannot exceed 9999.99.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    //rollover already added
    if (remaining > initial) {
        if (willShowErrorMessage) {
            data = {
                message: "The remaining should not exceed the initial + rollover.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    return true;
}

//checks if the start date is valid
//only show error message if true passed
function startDateIsValid(willShowErrorMessage) {
    if (!/(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/.test(String(startDate))) {
        if (willShowErrorMessage) {
            data = {
                message: "The start date should be in form MM/DD/YYYY.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    return true;
}

//checks if the end date is valid
//only show error message if true passed
function endDateIsValid(willShowErrorMessage) {
    if (!/(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/.test(String(endDate))) {
        if (willShowErrorMessage) {
            data = {
                message: "The end date should be in form MM/DD/YYYY.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    return true;
}

//checks if the end date is after the start date
function endDateIsAfterStartDate() {
    if (dayDiff < 1) {
        data = {
            message: "The end date must be at least 1 day after the start date.",
            timeout: 8000,
            actionHandler: hideSnackbar,
            actionText: "Dismiss"
        };
        showSnackbarMessage(data);
        hideResults();
        return false;
    }

    return true;
}

//gets the day difference between two dates
function getDateDiff(startingDate, endingDate) {
    return Math.floor((endingDate - startingDate) / (1000 * 60 * 60 * 24)) + 1;
}

//calculates the daily amount
function getDaily(amount, diffInDays) {
    return amount / diffInDays;
}

//calculates the weekly amount
function getWeekly(amount, diffInDays) {
    return getDaily(amount, diffInDays) * 7;
}

//checks if today is in the date range
function checkIfTodayInRange() {
    if (getDateDiff(start, today) < 0 || getDateDiff(end, today) > 0) {
        data = {
            message: "Today is not in the date range and some calculations may be off.",
            timeout: 8000,
            actionHandler: hideSnackbar,
            actionText: "Dismiss"
        };
        showSnackbarMessage(data);
    }
}

//checks if the total days off value is valid
//only show error message if true passed
function totalDaysOffIsValid(willShowErrorMessage) {
    if (totalDaysOff != 0 && !/\d{1,2}/.test(String(totalDaysOff))) {
        if (willShowErrorMessage) {
            data = {
                message: "The total days off must be a positive whole number.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    if (totalDaysOff > 99) {
        if (willShowErrorMessage) {
            data = {
                message: "The total days off cannot exceed 99.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    return true;
}

//checks if the past days off value is valid
//only show error message if true passed
function pastDaysOffIsValid(willShowErrorMessage) {
    if (pastDaysOff != 0 && !/\d{1,2}/.test(String(pastDaysOff))) {
        if (willShowErrorMessage) {
            data = {
                message: "The past days off must be a positive whole number.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    if (pastDaysOff > totalDaysOff) {
        if (willShowErrorMessage) {
            data = {
                message: "The past days off cannot exceed the total days off.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    if (pastDaysOff > 99) {
        if (willShowErrorMessage) {
            data = {
                message: "The past days off cannot exceed 99.",
                timeout: 8000,
                actionHandler: hideSnackbar,
                actionText: "Dismiss"
            };
            showSnackbarMessage(data);
        }

        hideResults();
        return false;
    }

    return true;
}

// shows the snackbar with given message
function showSnackbarMessage(textData) {
    notification.css("display", "block");
    notification[0].MaterialSnackbar.showSnackbar(textData);
}

// hides the snackbar
function hideSnackbar() {
    notification.css("display", "none");
}

// gets the fields and calls calculateAndSet() if all are valid
// used by calculate button
function getFieldsAndCheckManual() {
    //calculate and show error messages
    getFieldsAndCheck(true);
}

// gets the fields and calls calculateAndSet() if all are valid
//willShowErrorMessage - boolean, if error messages should be shown
function getFieldsAndCheck(willShowErrorMessage) {
    //setup - get & check input
    initial = getInitial();

    //validate initial, end if not
    if (!initialIsValid(willShowErrorMessage)) {
        return;
    }

    rollover = $("#rollover").val();
    //validate rollover, end if not
    if (!rolloverIsValid(willShowErrorMessage)) {
        return;
    }

    //add rollover to initial
    initial += Number(rollover);

    remaining = $("#remaining").val();
    //validate remaining, end if not
    if (!remainingIsValid(willShowErrorMessage)) {
        return;
    }

    startDate = $("#start-date").val();
    //validate startDate, end if not
    if (!startDateIsValid(willShowErrorMessage)) {
        return;
    }

    endDate = $("#end-date").val();
    //validate endDate, end if not
    if (!endDateIsValid(willShowErrorMessage)) {
        return;
    }

    totalDaysOff = $("#total-days-off").val();
    //validate totalDaysOff, end if not
    if (!totalDaysOffIsValid(willShowErrorMessage)) {
        return;
    }

    pastDaysOff = $("#past-days-off").val();
    //validate pastDaysOff, end if not
    if (!pastDaysOffIsValid(willShowErrorMessage)) {
        return;
    }

    //if no errors, hide any existing error messages
    hideSnackbar();

    //calculate and set values
    calculateAndSet();
}

//calculates the values and sets them in their places
function calculateAndSet() {
    //convert date Strings to Dates
    start = new Date(startDate.substring(6, 10), startDate.substring(0, 2) - 1, startDate.substring(3, 5));
    end = new Date(endDate.substring(6, 10), endDate.substring(0, 2) - 1, endDate.substring(3, 5));

    dayDiff = getDateDiff(start, end);
    //make sure end date after start date, end if not
    if (!endDateIsAfterStartDate()) {
        return;
    }

    //remove total days off from dayDiff
    dayDiff -= Number(totalDaysOff);

    const avgDaily = getDaily(initial, dayDiff);
    const avgWeekly = getWeekly(initial, dayDiff);

    today = new Date();
    let currentDayDiff = getDateDiff(today, end);
    //warn if today not in date range
    checkIfTodayInRange();

    //remove total days off
    currentDayDiff -= Number(totalDaysOff);

    //add back past days off
    currentDayDiff += Number(pastDaysOff);

    const curDaily = getDaily(remaining, currentDayDiff);
    const curWeekly = getWeekly(remaining, currentDayDiff);

    //set table fields with leading sign and $
    if (avgDaily >= 0) {
        $("#avg-daily").html("+$" + avgDaily.toFixed(2));
    } else {
        $("#avg-daily").html("-$" + Math.abs(avgDaily).toFixed(2));
    }

    if (avgWeekly >= 0) {
        $("#avg-weekly").html("+$" + avgWeekly.toFixed(2));
    } else {
        $("#avg-weekly").html("-$" + Math.abs(avgWeekly).toFixed(2));
    }

    if (curDaily >= 0) {
        $("#cur-daily").html("+$" + curDaily.toFixed(2));
    } else {
        $("#cur-daily").html("-$" + Math.abs(curDaily).toFixed(2));
    }

    if (curWeekly >= 0) {
        $("#cur-weekly").html("+$" + curWeekly.toFixed(2));
    } else {
        $("#cur-weekly").html("-$" + Math.abs(curWeekly).toFixed(2));
    }

    if (curDaily - avgDaily >= 0) {
        $("#diff-daily").html("+$" + (curDaily - avgDaily).toFixed(2));
    } else {
        $("#diff-daily").html("-$" + Math.abs(curDaily - avgDaily).toFixed(2));
    }

    if (curWeekly - avgWeekly >= 0) {
        $("#diff-weekly").html("+$" + (curWeekly - avgWeekly).toFixed(2));
    } else {
        $("#diff-weekly").html("-$" + Math.abs(curWeekly - avgWeekly).toFixed(2));
    }

    //debugging
    // document.getElementById("initial-text").innerHTML = "initial: " + (initial - rollover);
    // document.getElementById("rollover-text").innerHTML = "rollover: " + rollover;
    // document.getElementById("total-text").innerHTML = "total: " + initial;
    // document.getElementById("current-text").innerHTML = "remaining: " + remaining;
    // document.getElementById("start-text").innerHTML = "start: " + start;
    // document.getElementById("end-text").innerHTML = "end: " + end;
    // document.getElementById("dayDiff-text").innerHTML = "day diff: " + dayDiff;
    // document.getElementById("currentDayDiff-text").innerHTML = "current day diff: " + currentDayDiff;
    // document.getElementById("total-days-off-text").innerHTML = "total days off: " + totalDaysOff;
    // document.getElementById("past-days-off-text").innerHTML = "past days off: " + pastDaysOff;

    //set summary
    //excess from what you should have spent and the remaining
    //only uses the daily since currentDayDiff is the total number of days here
    const diff = remaining - (avgDaily * currentDayDiff);
    if (diff >= 0) {
        $("#summary").html("+$" + diff.toFixed(2));
    } else {
        $("#summary").html("-$" + Math.abs(diff).toFixed(2));
    }

    //show results
    showResults();

    //save input
    saveFields();
}

//when key pressed, calculate if enter
function calculateIfEnter() {
    if (event.keyCode == ENTER_KEY) {
        getFieldsAndCheckManual();
    }
}

//when clicking on help
function help() {
    $("span.ui-dialog-title").text("Help");
    $("#dialog-text1").html("&#8226; Hover over elements for descriptive hints.<br />" +
        "&#8226; To load defaults, click \"Clear saved\".<br />" +
        "&#8226; If you have any questions, bug reports, or suggestions, contact:");

    $("#dialog-link-text").html("alderferstudios@gmail.com");
    $("#dialog-link-text").attr("href", "mailto:alderferstudios@gmail.com?subject=RIT%20Dining%20Planner%20Web");

    $("#dialog-text2").html("&#8226; You can also submit these as issues on the Github repo.<br />" +
        "&#8226; Please include your browser and version with any bug reports.");
    dialog.dialog("open");
}

//when clicking on about
function about() {
    $("span.ui-dialog-title").text("About");
    $("#dialog-text1").html("RIT Dining Planner by Alderfer Studios.<br />" +
        "Browser support is based on what the design library (MDL) can support. These browsers are:<br />" +
        "&#8226; Chrome<br />" +
        "&#8226; Firefox<br />" +
        "&#8226; Opera<br />" +
        "&#8226; Edge*<br />" +
        "&#8226; Internet Explorer 11+*<br />" +
        "&#8226; Safari 8+*<br />" +
        "&#8226; Mobile Safari 8+*<br />" +
        "* May still have issues");
    $("#dialog-link-text").html("");
    $("#dialog-text2").html("");
    dialog.dialog("open");
}

//when clicking on source
function source() {
    $("span.ui-dialog-title").text("Source");
    $("#dialog-text1").html("This site is open source. You can find it here:");

    $("#dialog-link-text").html("https://github.com/BenAlderfer/rit-dining-planner-web");
    $("#dialog-link-text").attr("href", "https://github.com/BenAlderfer/rit-dining-planner-web");

    $("#dialog-text2").html("");
    dialog.dialog("open");
}

function addFieldListeners() {
    $("#plan").change(function () {
        getFieldsAndCheck(false)
    });
    $("input[type='number']").change(function () {
        getFieldsAndCheck(false)
    });
    $("input[type='text']").change(function () {
        getFieldsAndCheck(false)
    });
}

//hide things that shouldn't show all the time
planSelected(); //hide custom box if necessary
hideResults(); //hide results

setVarDefaults(); //sets variable defaults

//when page loaded
$(document).ready(function () {
    //assign datepickers and setup dialog
    $("#start-date").datepicker();
    $("#end-date").datepicker();

    dialog = $("#dialog");
    dialog.dialog({modal: true});
    dialog.dialog("close");

    addFieldListeners();

    //run start up items
    startUp();
});
