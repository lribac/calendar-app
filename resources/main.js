// Webpage WebElements 
let body = document.getElementById("body");
let selectMonth = document.getElementById("dropdownMenu1");
let selectYear = document.getElementById("dropdownMenu2");
let previousNextContainer = document.getElementById("previousNext");
let previousButton = document.getElementById("previous");
let nextButton = document.getElementById("next");
let addEvent = document.getElementById("add-event");
let closeIcon = document.getElementById("close-1");
let closeButton = document.getElementById("close-2");
let saveChanges = document.getElementById("saveChanges");
let addEventTitle = document.getElementById("exampleModalLabel");
let eventsContainer = document.getElementById("events-list-box");
let eventsListTitle = document.getElementById("events-title");
let eventsBox = document.getElementById("listBox");
let time = document.getElementById("inputMDEx1");
let desc = document.getElementById("exampleFormControlTextarea1");
let deleteEvButton = document.getElementById("deleteEvent");
let deleteModalTitle = document.getElementById("deleteModalTitle");
let recurForm = document.getElementById("recur-form");
let recurCheckbox = document.getElementById("recurEvent");
let recurTypes = document.getElementById("recur-types");
let everyDayRecur = document.getElementById("flexRadioDefault1");
let everyWeekRecur = document.getElementById("flexRadioDefault2");
let everyMonthRecur = document.getElementById("flexRadioDefault3");
let monthAndYear = document.getElementById("currentMonthYear");

// Handling current date
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

showCalendar(currentMonth, currentYear);

// Moving to desired dates using dropdowns and previous, next buttons
selectMonth.onchange = jump;
selectYear.onchange = jump;
previousButton.onclick = previous;
nextButton.onclick = next;

// Function for moving to the next month
function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

// Function for moving to the previous month
function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

// Function to move to the selected date, month in the top dropdowns
function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

// Engine to create the calendar for selected month, year
function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    // Body of the calendar
    let tbl = document.getElementById("calendar-body"); 

    // Clearing all previous cells
    tbl.innerHTML = "";

    // Filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // Creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        // Creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }

            else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                // Color today's date
                    cell.classList.add("bg-info");
                } 
                cell.appendChild(cellText);
                row.appendChild(cell);

                let dateKey = "" + (currentMonth+1) + "-" + date + "-" + currentYear;
                if(JSON.parse(window.localStorage.getItem(dateKey)) !== null){
                    let eventsDates = document.createElement("p");
                    eventsDates.className = "dot";
                    cell.appendChild(eventsDates);
                }
                date++;
            }

        }

        tbl.appendChild(row);
    }

}


// Interacting with dates at cell level
document.addEventListener('click',function(e){
    if(e.target && e.target.tagName == 'TD' && !(e.target.innerHTML === '')){
        if(e.target.classList.contains('selected')){
            e.target.classList.remove('selected');
            addEvent.style.display = 'none';
            e.target.style.backgroundColor = 'transparent';
            eventsListTitle.style.display = 'none';
            removeEventsHTML();

        }else {
            clearSelected();
            addEvent.style.display = 'inline';
            e.target.style.backgroundColor = 'lightgrey';
            e.target.classList.add('selected');
            eventsListTitle.style.display = 'inline';
            eventsListTitle.innerHTML = 'Events on ' + months[currentMonth] + ' ' + getSelectedDate() + ":";
            removeEventsHTML();
            getEvents();
        }
     }
 });


// Remove date events when year or month is changed
body.addEventListener('change', event => {
    if (event.target == selectYear || event.target == selectMonth) {
           addEvent.style.display = 'none';
           eventsListTitle.style.display = 'none';
           clearSelected();
           removeEventsHTML();
   }
});
 
body.addEventListener('click', event => {
    if (event.target == previousButton || event.target == nextButton) {
             addEvent.style.display = 'none';
             eventsListTitle.style.display = 'none';
             clearSelected();
             removeEventsHTML();
     }
});


// Display recur styles when recur checkbox is clicked
recurCheckbox.onclick = function() {
    if(recurCheckbox.checked){
        recurTypes.style.display = 'inline-flex';
    }else{
        recurTypes.style.display = 'none';
    } 
}


// Open up Add Event modal when clicking on Add Event button
addEvent.addEventListener('click', event => {
    addEventTitle.innerHTML = "Add Event on " + months[currentMonth] + " " + getSelectedDate() + ", " + currentYear;
    time.value = '';
    desc.value = '';
    recurForm.style.display = 'flex';
    recurCheckbox.checked = false;
    recurTypes.style.display = 'none';
    time.classList.remove('red-border');
    desc.classList.remove('red-border');
    saveChanges.innerHTML = "Save";
})


time.onblur = validateForm;
desc.onblur = validateForm;


// Add event engine 
function addEvents(time, desc){

    let recurStyle = '';

    if(recurCheckbox.checked){
        if(everyDayRecur.checked){
            recurStyle = 'everyDay';
        }else if(everyWeekRecur.checked){
            recurStyle = 'everyWeek';
        }else if(everyMonthRecur.checked){
            recurStyle = 'everyMonth';
        }
    }else {
        recurStyle = '';
    }
    
    let recurLimitDate = "December 31, " + currentYear;
    let recurLimitDateMil = new Date(recurLimitDate).getTime();
    // We add 12 hours to start date to avoid day light time issue;
    let startDate = new Date("" + months[currentMonth] + " " + getSelectedDate() + ", " + currentYear).getTime() + 43200000;
    if(recurStyle === 'everyDay'){
        let i = startDate;
        while(i <= recurLimitDateMil){
            let date = "" + months[new Date(i).getMonth()] + " " + new Date(i).getDate() + ", " + new Date(i).getFullYear();
            let objName = "" + (new Date(i).getMonth() + 1) + "-" + new Date(i).getDate() + "-" + new Date(i).getFullYear();
            let ev = {
                date: date,
                time: time, 
                desc: desc
            }

            let events = getEventsForDate(objName);
    
            events.push(ev);
            window.localStorage.setItem(objName, [JSON.stringify(events)]);

            // add 1 day in miliseconds;
            i = i + 86400000;
        }
    }else if(recurStyle === 'everyWeek'){
        let i = startDate;
        while(i <= recurLimitDateMil){
            let date = "" + months[new Date(i).getMonth()] + " " + new Date(i).getDate() + ", " + new Date(i).getFullYear();
            let objName = "" + (new Date(i).getMonth() + 1) + "-" + new Date(i).getDate() + "-" + new Date(i).getFullYear();
            let ev = {
                date: date,
                time: time, 
                desc: desc
            }

            let events = getEventsForDate(objName);
    
            events.push(ev);
            window.localStorage.setItem(objName, [JSON.stringify(events)]);

            // add 7 days in miliseconds;
            i = i + 86400000 * 7;
        }
    }else if(recurStyle === 'everyMonth'){
        let i = startDate;
        let j = 0;
        while(i <= recurLimitDateMil){
            let date = "" + months[new Date(i).getMonth()] + " " + new Date(i).getDate() + ", " + new Date(i).getFullYear();
            let objName = "" + (new Date(i).getMonth() + 1) + "-" + new Date(i).getDate() + "-" + new Date(i).getFullYear();
            let ev = {
                date: date,
                time: time, 
                desc: desc
            }

            let events = getEventsForDate(objName);
    
            events.push(ev);
            window.localStorage.setItem(objName, [JSON.stringify(events)]);


            // add 1 month in miliseconds;
            let daysInMonth = 32 - new Date(currentYear, (currentMonth + j), 32).getDate();
            let daysInNextMonth = 32 - new Date(currentYear, (currentMonth + j + 1), 32).getDate();
            let lastDateOfMonth = new Date("" + months[currentMonth + j] + " " + daysInMonth + ", " + currentYear).getTime() + 43200000;
            let selectedDate = getSelectedDate();
            let diff = 0;
            
            // Handle 28, 29, 30, 31 dates
            if ((lastDateOfMonth - i) > 0){
                diff = lastDateOfMonth - i;
            }else {
                diff = 0;
            }

            let add = parseInt(selectedDate);
            if(add > daysInNextMonth){
                add = daysInNextMonth;
            }else{
                add = parseInt(selectedDate);
            }
            
            i = i + diff + add * 86400000;
            j++;
    }
    }else {
        // No recurrence was selected
        let objName = "" + (currentMonth + 1) + "-" + getSelectedDate() + "-" + currentYear;
        let date = "" + months[currentMonth] + " " + getSelectedDate() + ", " + currentYear;
        let ev = {
            date: date,
            time: time, 
            desc: desc
        }

        let events = getEventsForDate(objName);
        
        events.push(ev);
        window.localStorage.setItem(objName, [JSON.stringify(events)]);
    }
}


// Validation for add event and edit event modal windows
function validateForm() {

    // let timeRegex = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?((?:A|P)\.?M\.?)$/i;

    saveChanges.removeAttribute("data-dismiss", "modal");
    if (time.value === "" && desc.value === "") {
        time.classList.add('red-border');
        desc.classList.add('red-border');
        return false;
    }else if (time.value == "" && !(desc.value == "")){
        time.classList.add('red-border');
        desc.classList.remove('red-border');
        return false;
    }else if (desc.value == "" && !(time.value == "") 
    // && (time.value.match(timeRegex))
    ) {
        desc.classList.add('red-border');
        time.classList.remove('red-border');
        return false;
    // }else if (!(time.value.match(timeRegex))){
    //     time.classList.add('red-border');
    //     // add helper text of field format
    //     return false;
    }else{
        time.classList.remove('red-border');
        desc.classList.remove('red-border');
        return true;
    }
}


// Add/edit event engine
saveChanges.addEventListener('click', event => {

    if(validateForm()){
    let t = time.value;
    let d = desc.value;
    addEvents(t, d);

    if (saveChanges.innerHTML === 'Save Changes'){
        let currentDay = getSelectedDate();
        let date = "" + (currentMonth+1) + "-" + currentDay + "-" + currentYear;
        let allDayEvents = JSON.parse(window.localStorage.getItem(date));
        let eventToEdit = window.localStorage.getItem("eventForEditing");
        let editTime = eventToEdit.slice(0, 5);
        let editDesc = eventToEdit.slice(8, (eventToEdit.length - 1));

        const objToDelete = allDayEvents.filter(obj => {
            return (obj.time === editTime && obj.desc === editDesc);
        }); 

        const valueToDelete = getValuesOfArray(objToDelete);
        const remainingEvents = allDayEvents.filter(item => item !== valueToDelete);

        window.localStorage.setItem(date, [JSON.stringify(remainingEvents)]);
    }

    let currentDay = getSelectedDate();

    saveChanges.setAttribute("data-dismiss", "modal");
    removeEventsHTML();
    getEvents();
    showCalendar(currentMonth, currentYear);

    // add 'selected' property after creating a new calender to further add events;
    for (const t of document.querySelectorAll("td")) {
        if (t.textContent.includes(currentDay)) {
            t.classList.add('selected');
            if(!(t.classList.contains('bg-info'))){
                t.style.backgroundColor = 'lightgrey';
            }
        }
    }

}});

// List events for a date 
function getEvents() {
    let date = "" + (currentMonth+1) + "-" + getSelectedDate() + "-" + currentYear;
    let result = JSON.parse(window.localStorage.getItem(date));
    let sortedResult = _.sortBy(result, "time");

    if (result){
        sortedResult.forEach(function (event){
            const node = document.createElement("li");
            node.className = "list-group-item d-flex justify-content-between align-items-center";
            const textnode = document.createTextNode(`${event.time} - ${event.desc}`);
            node.appendChild(textnode);

            const editDelete = document.createElement("div");
            editDelete.className = "flex-row-reverse";

            const edit = document.createElement("button");
            edit.className = "btn btn-warning edit";
            edit.setAttribute("data-toggle", "modal");
            edit.setAttribute("data-target", "#exampleModal");
            const editText = document.createTextNode("Edit");
            edit.appendChild(editText);

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger delete";
            deleteButton.setAttribute("data-toggle", "modal");
            deleteButton.setAttribute("data-target", "#deleteModal");
            const deleteText = document.createTextNode("Delete");
            deleteButton.appendChild(deleteText);

            editDelete.appendChild(edit);
            editDelete.appendChild(deleteButton);
            node.appendChild(editDelete);

            eventsBox.appendChild(node);
        });
    }else {
        const node = document.createElement("p");
        const textnode = document.createTextNode('No events');
        node.appendChild(textnode);
        eventsBox.appendChild(node);
    }

    // Set event to delete in local storage from the listed events.
    // Done inside getEvents() because delete is added dynamicaly.
    document.querySelectorAll('.delete').forEach(item => {
        item.addEventListener('click', event => {
            let dateEvent = item.parentElement.parentElement.innerText.replace('EditDelete', '');

            window.localStorage.setItem('eventForDeletion', dateEvent);
            let eventToDelete = window.localStorage.getItem('eventForDeletion');
            deleteModalTitle.innerHTML = 'Delete event: ' + eventToDelete;
        });
    });

    // Set event to edit in local storage from the listed events.
    // Done inside getEvents() because delete is added dynamicaly.
    document.querySelectorAll('.edit').forEach(item => {
        item.addEventListener('click', event => {
            time.classList.remove('red-border');
            desc.classList.remove('red-border');
            let dateEvent = item.parentElement.parentElement.innerText.replace('EditDelete', '');


            recurCheckbox.checked = false;
            recurForm.style.display = 'none';
            recurTypes.style.display = 'none';
            saveChanges.innerHTML = "Save Changes"

            window.localStorage.setItem('eventForEditing', dateEvent);
            let eventToEdit = window.localStorage.getItem('eventForEditing');
            let editTime = eventToEdit.slice(0, 5);
            let editDesc = eventToEdit.slice(8, (eventToEdit.length - 1));
            addEventTitle.innerHTML = 'Edit event: ' + eventToEdit;
            time.value = editTime;
            desc.value = editDesc;
        });
    });
}

// Change colspan of first title table row
const mediaQuery = window.matchMedia('(max-width: 800px)')
if (mediaQuery.matches) {
    monthAndYear.colSpan = "4";
    previousNextContainer.colSpan= "3";
}

// Delete event on clicking Delete button
deleteEvButton.addEventListener('click', event => {

    debugger; 

    let currentDay = getSelectedDate();
    let date = "" + (currentMonth+1) + "-" + currentDay + "-" + currentYear;
    let allDayEvents = JSON.parse(window.localStorage.getItem(date));
    let eventToDelete = window.localStorage.getItem("eventForDeletion");
    let deleteTime = eventToDelete.slice(0, 5);
    let deleteDesc = eventToDelete.slice(8, (eventToDelete.length - 1));

    const objToDelete = allDayEvents.filter(obj => {
        return (obj.time === deleteTime && obj.desc === deleteDesc);
    }); 

    const valueToDelete = getValuesOfArray(objToDelete);
    const remainingEvents = allDayEvents.filter(item => item !== valueToDelete);

    if(remainingEvents.length == 0){
        window.localStorage.removeItem(date);
    }else {
        window.localStorage.setItem(date, [JSON.stringify(remainingEvents)]);
    };

    deleteEvButton.setAttribute("data-dismiss", "modal");

    removeEventsHTML();
    getEvents();
    showCalendar(currentMonth, currentYear);

    // add 'selected' property after creating a new calender to further delete events;
    for (const t of document.querySelectorAll("td")) {
        if (t.textContent.includes(currentDay)) {
          t.classList.add('selected');
          if(!(t.classList.contains('bg-info'))){
            t.style.backgroundColor = 'lightgrey';
        }
        }
    }
});


// Helper functions
function clearSelected() {
    document.querySelectorAll('td').forEach(item => {
        item.classList.remove('selected');
        item.style.backgroundColor = 'transparent';
    })
}

function getSelectedDate() {
    return document.querySelector('.selected').textContent;
}

function getEventsForDate(objName) {
    let allEvents = window.localStorage.getItem(objName) ? JSON.parse(window.localStorage.getItem(objName)) : [];
    return allEvents;
}

function removeEventsHTML() {
    while(eventsBox.firstChild){
        eventsBox.removeChild(eventsBox.firstChild);
      }
}

function getValuesOfArray(arr){
    const iterator = arr.values();

    for (const value of iterator) {
      return value;
    }
}

