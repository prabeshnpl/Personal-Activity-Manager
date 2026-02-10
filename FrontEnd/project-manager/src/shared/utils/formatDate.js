export const formatDate = (dateString, blankDefault="No date found") => {
if (!dateString) return blankDefault;
var date = new Date(dateString);
date = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});
return date
};
