<% session("id")="" 
session("name")=""
session("country")=""
session("phone")=""
session("sort")=" ORDER BY id" %>
<html dir='rtl'>
<head>
<link href='Design.css' rel='stylesheet'>
<script language='javascript'>
function isValid()
{
	if (frmSearch.txtPhone.value == "")
	{
		return false;
	}
	else
	{
		return true;
	}
}
</script>
</head>
<body onload="frmSearch.txtPhone.focus()">

<%

if (request.Form("txtPhone") <> "") then
 session("phone") = request.Form("txtPhone")
 session("whereClause") = " WHERE phone LIKE '%" & request.Form("txtPhone") &"%' or phone2 LIKE '%" & request.Form("txtPhone") &"%' or phone3 LIKE '%" & request.Form("txtPhone") &"%'"
 session("displayWhere") = "�� ���� ������ " & request.Form("txtPhone")
 response.redirect("ShowAll.asp")
 response.redirect("ShowById.asp")
 else %>
<center>
<h2 align='center'>����� ���� �� �� ���� �����</h2>
<form name='frmSearch' action='SearchPhone.asp' method='post' onsubmit='return isValid()'>
���� ����:
<input type='text' name="txtPhone">
<input type='submit' value='���' class="button">
</form>
</center>
<% end if %>
</body>
</html>
