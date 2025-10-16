# OCI provider template - fill variables before use
provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}

resource "oci_core_virtual_network" "vcn" {
  compartment_id = var.compartment_ocid
  display_name   = "kubiciranje-vcn"
  cidr_block     = "10.0.0.0/16"
}

resource "oci_core_subnet" "subnet" {
  compartment_id      = var.compartment_ocid
  vcn_id              = oci_core_virtual_network.vcn.id
  cidr_block          = "10.0.1.0/24"
  display_name        = "kubiciranje-subnet"
  prohibit_public_ip_on_vnic = false
}
