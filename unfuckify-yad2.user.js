// ==UserScript==
// @name          Unfuckify yad2
// @namespace     http://www.eran.io
// @version       0.0.3
// @description   Make using yad2 not want to make you kill yourself
// @match         www.yad2.co.il/Nadlan/rent.php?*
// @match         www.yad2.co.il/Nadlan/sales.php?*
// @match         www.yad2.co.il/Nadlan/rent_info.php?*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// ==/UserScript==

// hide piece of shit distractions
[
    // uncomment the following line to remove tivuch
    // ".main_table_wrap:eq(1)",

    ".bannerBetweenTables_main",
    ".search_banners",
    "#Hotpics",
    "#lastsearch_block",
    "iframe",
    ".walla_strip",
    ".articles_block",
    "#footer",
    ".intro_block",
    "#GamboBanner",
    "#rtower",
    ".banner_strip",
    "#top_banners",
    "[alt*='Platinum']",
    "#ad_martef",
    '.left_column > div:last-of-type'

].forEach(function(elementName) {
    $(elementName).hide();
});

// remove piece of shit distractions
[
    "#GamboBanner",
    "#rtower",
    "#leftSekindo",
    "#facebookBox",
    "#dynamicLeftBanner",
    ".moving_promotion_deals_back",
    ".platinum",
    "[id*='Fusion_holder_']"

].forEach(function(elementName) {
    $(elementName).remove();
});

function getBackgroundColorBySeen(seen) {

    return (seen === 1) ? '#FCF3D7' : '#E2E3E8';
}

function loadAdState(aid) {

    // read from local storage, deserialize
    var adState = JSON.parse(localStorage.getItem(aid));

    // return the loaded adstate or some default
    return adState || {seen: 0, interest: true};
}

function saveAdState(aid, state) {

    // just save
    localStorage.setItem(aid, JSON.stringify(state));
}

function renderRowInterest(rowElement, aid, interest) {

    var lastTdText = interest ? '-' : '+';
    var rowTextColor = interest ? '#000000' : '#BBBBBB';

    // change "details" to "dont give a fuck"
    rowElement.find('td:last-child').html(lastTdText).click({aid: aid, interest: !interest}, setAdInterest);
    rowElement.find('td').css('color', rowTextColor);
}

function setAdInterest(event) {

    // update interest
    var adState = loadAdState(event.data.aid);
    adState.interest = event.data.interest;
    saveAdState(event.data.aid, adState);

    // re-render row
    renderRowInterest($(this).parent(), event.data.aid, event.data.interest);
}

function augmentAds(adPrefix, linkPrefix) {
    $("tr[id^='" + adPrefix + "']").each(function(index) {

        // get the ad identifier
        var aid = $(this).attr('id').replace(adPrefix, '');

        // get the attributes for this ad, use default
        var adState = loadAdState(aid);

        // increment # of times we've seen this ad
        adState.seen += 1;

        // indicate how many times we've seen it
        $(this).find('td:eq(1)').html('<a href=http://www.yad2.co.il/Nadlan/' + linkPrefix + aid + '>' + adState.seen + '</a>');

        // set background color
        $(this).find('td')
        .css('background', getBackgroundColorBySeen(adState.seen))
        .css('font-weight', 'normal');

        // change the row to reflect if we've expressed disgust at it yet
        renderRowInterest($(this), aid, adState.interest);

        // save what we know about this item
        saveAdState(aid, adState);
    });
}

// augment rent and 
augmentAds('tr_Ad_2_2_', 'rent_info.php?NadlanID=');
augmentAds('tr_Ad_2_6_', 'tivrent_info.php?NadlanID=');
augmentAds('tr_Ad_2_1_', 'sales_info.php?NadlanID=');
augmentAds('tr_Ad_2_5_', 'tivsales_info.php?NadlanID=');
