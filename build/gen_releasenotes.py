#Script to generate changelog

# Author: Poornima Eluru <peluru@innominds.com
#!/usr/bin/env python2.7
import xml.etree.ElementTree as ET
import os
BUILDNUM = os.environ['BUILD_NUMBER']

def _gen_releasenote(data):
    tree = ET.parse(data, ET.XMLParser(data))
    root = tree.getroot()
    commit_IDs=""
    authors=""
    projects=""
    dates=""
    committexts=""
    for actions in root.findall('logentry'):
        commit_ID = actions.find('revision').text
        commit_IDs += commit_ID
        commit_IDs += ","
        author = actions.find('author').text
        authors += author
        authors += ","
        date = actions.find('date').text
        dates += date
        dates += "|"
        committext = actions.find('msg').text
        committexts += committext.encode('utf-8')
        committexts += "|"
    list_commit = commit_IDs.split(",")
    list_author=authors.split(",")
    list_date=dates.split("|")
    committexts=committexts.replace("\n","<br />")
    list_desc=committexts.split("|")
    if len(list_desc) > 0:
            f = open('releasenotes_UI_%s.html' %(BUILDNUM),'w')
            f.write('<HEAD>      <TITLE>         Release Notes      </TITLE>   </HEAD>')

            f.write('<BODY>   <H4>Changes merged</H1><table border=1><tr></tr><tr><b> <td><b>Description</b></td> <td><b>Commitor</b></td> <td><b>CommitID</b></td><td><b>Date</b><td></b></tr>')
            for Desc,aut,com,dat in zip(list_desc,list_author,list_commit,list_date):
                f.write('<tr><td><p>%s</p></td><td>%s</td> <td>%s</td><td>%s</td></tr>'%(Desc,aut,com,dat))
            print "Successfully generated 'releasenotes.html'"
            f.close()
    else:
        print "No list found"

filecheck = os.path.exists("changelog.xml")
if filecheck is True:
    _gen_releasenote("changelog.xml")

