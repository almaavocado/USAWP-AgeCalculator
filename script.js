document.getElementById('ageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const birthdate = new Date(document.getElementById('birthdate').value);
    const today = new Date();
    const currentYear = today.getFullYear();
    const ageAsOfDate = new Date(currentYear, 7, 1); // August 1st of the current year
    
    let age = ageAsOfDate.getFullYear() - birthdate.getFullYear();
    const monthDiff = ageAsOfDate.getMonth() - birthdate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && ageAsOfDate.getDate() < birthdate.getDate())) {
        age--;
    }
    
    let ageGroup = '';
    
    if (age < 7) {
        ageGroup = 'Not Eligible';
    } else if (age <= 9) {
        ageGroup = 'Splashball';
    } else if (age <= 10) {
        ageGroup = '10U';
    } else if (age <= 12) {
        ageGroup = '12U';
    } else if (age <= 14) {
        ageGroup = '14U';
    } else if (age <= 16) {
        ageGroup = '16U';
    } else if (age <= 18) {
        ageGroup = '18U';
    } else {
        ageGroup = 'Not Eligible';
    }
    
    // Clear previous result
    document.getElementById('result').innerText = '';
    
    // Display new result
    document.getElementById('result').innerText = `Age Group: ${ageGroup}`;
});