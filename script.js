document.getElementById('ageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const birthdate = new Date(document.getElementById('birthdate').value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    
    let ageGroup = '';
    
    if (age <= 10) {
        ageGroup = 'Under 10';
    } else if (age <= 12) {
        ageGroup = 'Under 12';
    } else if (age <= 14) {
        ageGroup = 'Under 14';
    } else if (age <= 16) {
        ageGroup = 'Under 16';
    } else if (age <= 18) {
        ageGroup = 'Under 18';
    } else {
        ageGroup = 'Adult';
    }
    
    // Clear previous result
    document.getElementById('result').innerText = '';
    
    // Display new result
    document.getElementById('result').innerText = `Age Group: ${ageGroup}`;
});