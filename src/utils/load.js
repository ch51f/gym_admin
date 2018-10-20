// use localStorage to store the authority info, which might be sent from server in actual project.
export function getToken() {
  return localStorage.getItem('token') || '';
}

export function setToken(token) {
  return localStorage.setItem('token', token);
}

export function getOperatorId() {
  return localStorage.getItem('operator_id') || '';
}

export function setOperatorId(operator_id) {
  return localStorage.setItem('operator_id', operator_id);
}

export function getOperatorName() {
  return localStorage.getItem('operator_name') || '';
}

export function setOperatorName(operator_name) {
  return localStorage.setItem('operator_name', operator_name);

}


export function getTitle() {
  return localStorage.getItem('title') || '';
}

export function setTitle(title) {
	return localStorage.setItem('title', title)
}