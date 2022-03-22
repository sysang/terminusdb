:- begin_tests(literals).
:- use_module(literals).

test(literal_to_string, []) :-
    \+ literal_to_string(42^^'http://www.w3.org/2001/XMLSchema#string', _),
    \+ literal_to_string("a"^^'http://www.w3.org/2001/XMLSchema#boolean', _),
    literal_to_string('http://b'^^'http://www.w3.org/2001/XMLSchema#string', 'http://b').

test(date, []) :-
    literal_to_turtle(date_time(-228, 10, 10, 0, 0, 0, 0)^^'http://www.w3.org/2001/XMLSchema#dateTime', literal(type('http://www.w3.org/2001/XMLSchema#dateTime','-228-10-10T00:00:00Z'))).

test(bool, []) :-
    literal_to_turtle(false^^'http://www.w3.org/2001/XMLSchema#boolean', literal(type('http://www.w3.org/2001/XMLSchema#boolean',false))).

test(double, []) :-
    literal_to_turtle(33.4^^'http://www.w3.org/2001/XMLSchema#double', literal(type('http://www.w3.org/2001/XMLSchema#double','33.4'))).

:- end_tests(literals).
